# Server

# DB creation

```sql
--
-- TABLES
--

CREATE TABLE person (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	username Text NOT NULL UNIQUE );

CREATE TABLE account (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title Text NOT NULL,
	username Text NOT NULL REFERENCES person(username) ON DELETE Cascade);

CREATE TABLE time_gap_type (
	id SERIAL PRIMARY KEY,
	title Text NOT NULL UNIQUE );

CREATE TABLE income_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title Text NOT NULL UNIQUE );

CREATE TABLE income (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	notes Text NOT NULL,
	record_date Date NOT NULL CHECK (record_date <= CURRENT_DATE),
	amount_of_money Money NOT NULL CHECK (amount_of_money::Numeric > 0),
	account_id UUID NOT NULL REFERENCES account(id) ON DELETE Cascade,
	category_id UUID NOT NULL REFERENCES income_category(id) ON DELETE Cascade );

CREATE TABLE recurring_income (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	notes Text NOT NULL,
	end_date Date NOT NULL CHECK (end_date >= CURRENT_DATE),
	start_date Date NOT NULL,
	amount_of_money Money NOT NULL CHECK (amount_of_money::Numeric > 0),
	time_gap_type_value Integer NOT NULL CHECK (time_gap_type_value::Numeric > 0),
	time_gap_type_id NUMBER NOT NULL REFERENCES time_gap_type(id) ON DELETE Cascade,
	category_id UUID NOT NULL REFERENCES income_category(id) ON DELETE Cascade,
	account_id UUID NOT NULL REFERENCES account(id) ON DELETE Cascade );

CREATE TABLE spend_category (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title Text NOT NULL UNIQUE );

CREATE TABLE spend (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	notes Text NOT NULL,
	record_date Date NOT NULL CHECK (record_date <= CURRENT_DATE),
	amount_of_money Money NOT NULL CHECK (amount_of_money::Numeric > 0),
	account_id UUID NOT NULL REFERENCES account(id) ON DELETE Cascade,
	category_id UUID NOT NULL REFERENCES spend_category(id) ON DELETE Cascade );

CREATE TABLE recurring_spend (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	notes Text NOT NULL,
	end_date Date NOT NULL CHECK (end_date >= CURRENT_DATE),
	start_date Date NOT NULL,
	amount_of_money Money NOT NULL CHECK (amount_of_money::Numeric > 0),
	time_gap_type_value Integer NOT NULL CHECK (time_gap_type_value::Numeric > 0),
	time_gap_type_id NUMBER NOT NULL REFERENCES time_gap_type(id) ON DELETE Cascade,
	category_id UUID NOT NULL REFERENCES spend_category(id) ON DELETE Cascade,
	account_id UUID NOT NULL REFERENCES account(id) ON DELETE Cascade );


--
-- VIEWS
--

CREATE OR REPLACE VIEW account_view AS
SELECT
  account.id,
  account.title,
  COALESCE(SUM(income.amount_of_money::numeric), 0) - COALESCE(SUM(spend.amount_of_money::numeric), 0) AS balance
FROM account
FULL OUTER JOIN income ON income.account_id = account.id
FULL OUTER JOIN spend ON spend.account_id = account.id
WHERE account.username = current_user
GROUP BY account.id;



CREATE OR REPLACE VIEW transactions_view AS
	with all_income_and_spend as (
		SELECT  income.id,
			income.notes,
			income.account_id,
			income.record_date::timestamp without time zone AT TIME ZONE 'UTC' AS record_date,
			income.amount_of_money::numeric,
			json_build_object('id', income_category.id, 'title', income_category.title)::text AS category,
			'income' AS type
		FROM income
		JOIN income_category ON income_category.id = income.category_id
		WHERE income.account_id = account_id
		UNION
		SELECT spend.id,
			spend.notes,
			spend.account_id,
			spend.record_date::timestamp without time zone AT TIME ZONE 'UTC' AS record_date,
			0 - spend.amount_of_money::numeric as amount_of_money,
			json_build_object('id', spend_category.id, 'title', spend_category.title)::text AS category,
			'spend' AS type
		FROM spend
		JOIN spend_category ON spend_category.id = spend.category_id
		WHERE spend.account_id = account_id
	)	SELECT
		all_income_and_spend.id,
		all_income_and_spend.notes,
		all_income_and_spend.account_id,
		all_income_and_spend.record_date,
		all_income_and_spend.amount_of_money::numeric,
		all_income_and_spend.category::json,
		all_income_and_spend.type
	from all_income_and_spend
	join account ON account.id = all_income_and_spend.account_id
	WHERE account.username = current_user
	ORDER BY record_date;



CREATE OR REPLACE VIEW recurring_transactions_view AS
	WITH transactions AS (
		SELECT
			ri.id,
			notes,
			end_date::timestamp without time zone AT TIME ZONE 'UTC' AS end_date,
			start_date::timestamp without time zone AT TIME ZONE 'UTC' AS start_date,
			account_id,
			amount_of_money::numeric,
			time_gap_type_value,
			json_build_object('id', income_category.id, 'title', income_category.title)::text AS category,
			json_build_object('id', time_gap_type.id, 'title', time_gap_type.title)::text AS time_gap_type,
			'income' AS type
		FROM recurring_income ri
		JOIN account ON account.id = ri.account_id
		JOIN income_category ON income_category.id = ri.category_id
		JOIN time_gap_type ON time_gap_type.id = ri.time_gap_type_id
		WHERE account.username = CURRENT_USER
		UNION
		SELECT
			rs.id,
			notes,
			end_date::timestamp without time zone AT TIME ZONE 'UTC' AS end_date,
			start_date::timestamp without time zone AT TIME ZONE 'UTC' AS start_date,
			account_id,
			0 - rs.amount_of_money::numeric AS amount_of_money,
			time_gap_type_value,
			json_build_object('id', spend_category.id, 'title', spend_category.title)::text AS category,
			json_build_object('id', time_gap_type.id, 'title', time_gap_type.title)::text AS time_gap_type,
			'spend' AS type
		FROM recurring_spend rs
		JOIN account ON account.id = rs.account_id
		JOIN spend_category ON spend_category.id = rs.category_id
		JOIN time_gap_type ON time_gap_type.id = rs.time_gap_type_id
		WHERE account.username = CURRENT_USER
		) SELECT
			transactions.id,
			transactions.notes,
			transactions.end_date,
			transactions.start_date,
			transactions.account_id,
			transactions.amount_of_money,
			transactions.category::json,
			transactions.time_gap_type_value,
			transactions.time_gap_type::json,
			transactions.type
		FROM transactions
		ORDER BY start_date DESC,
			end_date DESC;



--
-- FUNCTIONS AND TRIGGERS
--

CREATE OR REPLACE FUNCTION check_spend_limit_on_insert()
RETURNS TRIGGER AS $$
DECLARE
    total_income MONEY;
    total_spend MONEY;
BEGIN
    SELECT COALESCE(SUM(i.amount_of_money), 0::Money) INTO total_income
    FROM income i WHERE i.account_id = NEW.account_id;

    SELECT COALESCE(SUM(s.amount_of_money), 0::Money) INTO total_spend
    FROM spend s WHERE s.account_id = NEW.account_id;

    IF total_income < total_spend + NEW.amount_of_money THEN
        RAISE EXCEPTION 'Spend amount exceeds income for this account.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger event
CREATE TRIGGER block_exceeding_spend_limit_on_insert
BEFORE INSERT ON Spend
FOR EACH ROW
EXECUTE FUNCTION check_spend_limit_on_insert();



CREATE OR REPLACE FUNCTION check_spend_limit_on_update()
RETURNS TRIGGER AS $$
DECLARE
    total_income MONEY;
    total_spend MONEY;
BEGIN
    SELECT COALESCE(SUM(i.amount_of_money), 0::Money) INTO total_income
    FROM income i WHERE i.account_id = NEW.account_id;

    SELECT COALESCE(SUM(s.amount_of_money), 0::Money) INTO total_spend
    FROM spend s WHERE s.account_id = NEW.account_id AND s.id <> NEW.id;

    IF total_income < total_spend + NEW.amount_of_money THEN
        RAISE EXCEPTION 'Spend amount exceeds income for this account.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger event
CREATE TRIGGER block_exceeding_spend_limit_on_update
BEFORE UPDATE ON Spend
FOR EACH ROW
EXECUTE FUNCTION check_spend_limit_on_update();



CREATE OR REPLACE FUNCTION category_percentage(table_type TEXT, months_to_include INTEGER, before_date DATE, accountId UUID)
RETURNS TABLE(category TEXT, percentage NUMERIC)
AS $$
DECLARE
  total_money MONEY;
BEGIN
  IF table_type = 'spend' THEN
    RETURN QUERY
	-- tbc = total_by_category
	WITH tbc AS ( 	SELECT * FROM spend
		WHERE record_date >= (before_date - INTERVAL '1' MONTH * months_to_include)
			AND record_date <= before_date
			AND account_id = accountId
	), total_money AS (
		SELECT SUM(amount_of_money)
		FROM tbc	)
	SELECT sc.title AS category, COALESCE(ROUND((SUM(amount_of_money) * 100 / (select * from total_money))::numeric, 2), 0) AS percentage
    FROM spend_category AS sc
    FULL OUTER JOIN tbc ON tbc.category_id = sc.id
    GROUP BY sc.id
    ORDER BY sc.id;

  ELSIF table_type = 'income' THEN
    RETURN QUERY
	-- tbc = total_by_category
	WITH tbc AS (
		SELECT * FROM income
		WHERE record_date >= (before_date - INTERVAL '1' MONTH * months_to_include)
		AND record_date <= before_date
		AND account_id = accountId
	), total_money AS (
		SELECT SUM(amount_of_money)FROM tbc
	)
	SELECT ic.title AS category_id, COALESCE(ROUND((SUM(amount_of_money) * 100 / (select * from total_money))::numeric, 2), 0) AS percentage
    FROM income_category AS ic
    FULL OUTER JOIN tbc ON tbc.category_id = ic.id
    GROUP BY ic.id
    ORDER BY ic.id;
  ELSE
    RAISE EXCEPTION 'Invalid type: %', table_type;
  END IF;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION transactions_by_account_id (accountId text)
RETURNS TABLE(
	id UUID,
	notes text,
	account_id UUID,
	record_date timestamp with time zone,
	amount_of_money numeric,
	category json,
	type text
) AS $$
BEGIN
	RETURN QUERY
	SELECT * FROM transactions_view
	WHERE transactions_view.account_id = accountId::UUID
	ORDER BY record_date DESC;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION recurring_transactions_by_account_id
(accountId text)
RETURNS TABLE (
	id UUID,
	notes text,
	end_date timestamp with time zone,
	start_date timestamp with time zone,
	account_id UUID,
	amount_of_money numeric,
	category json,
	time_gap_type_value integer,
	time_gap_type json,
	type text
) AS $$
BEGIN
	RETURN QUERY
	SELECT * FROM recurring_transactions_view
	WHERE recurring_transactions_view.account_id = accountId::UUID
	ORDER BY start_date DESC,
		end_date DESC;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
DECLARE
  role_name TEXT;
BEGIN
	SELECT p.rolname::TEXT INTO role_name
	FROM pg_roles r
	JOIN pg_auth_members m ON r.oid = m.member
	JOIN pg_roles p ON m.roleid = p.oid
	WHERE r.rolname = current_user;
RETURN role_name;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION create_parent(username TEXT, passwrd TEXT)
RETURNS void AS
$$ BEGIN
	EXECUTE 'CREATE ROLE ' || quote_ident(username) || ' LOGIN PASSWORD ' || quote_literal(passwrd);
  	INSERT INTO person (username) VALUES (username);
		EXECUTE 'GRANT parent TO ' || quote_ident(username);
		EXECUTE 'ALTER ROLE ' || quote_ident(username) || ' WITH CREATEROLE';
END; $$
LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION create_child(username TEXT, passwrd TEXT)
RETURNS void AS
$$ BEGIN
	EXECUTE 'CREATE ROLE ' || quote_ident(username) || ' LOGIN PASSWORD ' || quote_literal(passwrd);
  	INSERT INTO person (username) VALUES (username);
		EXECUTE 'GRANT child TO ' || quote_ident(username);
END; $$
LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION create_account(title_name TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO account (title, username)
  VALUES (title_name, current_user);
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION get_account_transactions_stats_by_account_id (accountId text)
RETURNS TABLE(
	id UUID,
	title text,
	income json,
	spend json
) AS $$
BEGIN
        RETURN QUERY
	with year_income as (
                select account_id, SUM(amount_of_money)::numeric as year
                from income
                WHERE date_trunc('year', record_date) = date_trunc('year', now())
                group by account_id
        ), quarter_income as (
                SELECT account_id, SUM(amount_of_money)::numeric as quarter
                FROM income
                WHERE date_trunc('quarter', record_date) = date_trunc('quarter', now())
                GROUP BY account_id
        ), month_income as (
                SELECT account_id, SUM(amount_of_money)::numeric as month
                FROM income
                WHERE date_trunc('month', record_date) = date_trunc('month', now())
                GROUP BY account_id
        ), year_spend as (
                select account_id, SUM(amount_of_money)::numeric as year
                from spend
                WHERE date_trunc('year', record_date) = date_trunc('year', now())
                group by account_id
        ), quarter_spend as (
                SELECT account_id, SUM(amount_of_money)::numeric as quarter
                FROM spend
                WHERE date_trunc('quarter', record_date) = date_trunc('quarter', now())
                GROUP BY account_id
        ), month_spend as (
                SELECT account_id, SUM(amount_of_money)::numeric as month
                FROM spend
                WHERE date_trunc('month', record_date) = date_trunc('month', now())
                GROUP BY account_id
        ) select account.id, account.title,
                json_build_object(
                        'year', COALESCE(year_income.year, 0),
                        'quarter', COALESCE(quarter_income.quarter, 0),
                        'month', COALESCE(month_income.month, 0)
                ) as income,
                json_build_object(
                        'year', COALESCE(year_spend.year, 0),
                        'quarter', COALESCE(quarter_spend.quarter, 0),
                        'month', COALESCE(month_spend.month, 0)
                ) as spend
	FROM account
	FULL OUTER JOIN year_income on account.id = year_income.account_id
	FULL OUTER JOIN quarter_income on account.id = quarter_income.account_id
	FULL OUTER JOIN month_income on account.id = month_income.account_id
	FULL OUTER JOIN year_spend on account.id = year_spend.account_id
	FULL OUTER JOIN quarter_spend on account.id = quarter_spend.account_id
	FULL OUTER JOIN month_spend on account.id = month_spend.account_id
	WHERE account.username = current_user
		AND account.id = accountId::UUID;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION get_users_stats()
RETURNS TABLE(
	username text,
	income json,
	spend json
) AS $$
BEGIN
  RETURN QUERY
		WITH year_income AS (
                SELECT account.username, COALESCE(SUM(amount_of_money)::numeric, 0) AS year
                FROM income
                JOIN account ON account.id = income.account_id
                WHERE date_trunc('year', record_date) = date_trunc('year', now())
                GROUP BY account.username
        ), quarter_income AS (
                SELECT account.username, SUM(amount_of_money)::numeric AS quarter
                FROM income
                JOIN account ON account.id = income.account_id
                WHERE date_trunc('quarter', record_date) = date_trunc('quarter', now())
                GROUP BY account.username
        ), month_income AS (
                SELECT account.username, SUM(amount_of_money)::numeric AS month
                FROM income
                JOIN account ON account.id = income.account_id
                WHERE date_trunc('month', record_date) = date_trunc('month', now())
                GROUP BY account.username
        ), year_spend AS (
                select account.username, SUM(amount_of_money)::numeric AS year
                from spend
                JOIN account ON account.id = spend.account_id
                WHERE date_trunc('year', record_date) = date_trunc('year', now())
                group by account.username
        ), quarter_spend AS (
                SELECT account.username, SUM(amount_of_money)::numeric AS quarter
                FROM spend
                JOIN account ON account.id = spend.account_id
                WHERE date_trunc('quarter', record_date) = date_trunc('quarter', now())
                GROUP BY account.username
        ), month_spend AS (
                SELECT account.username, SUM(amount_of_money)::numeric AS month
                FROM spend
                JOIN account ON account.id = spend.account_id
                WHERE date_trunc('month', record_date) = date_trunc('month', now())
                GROUP BY account.username
        ) SELECT person.username,
                json_build_object(
                        'year', COALESCE(year_income.year, 0),
                        'quarter', COALESCE(quarter_income.quarter, 0),
                        'month', COALESCE(month_income.month, 0)
                ) AS income,
                json_build_object(
                        'year', COALESCE(year_spend.year, 0),
                        'quarter', COALESCE(quarter_spend.quarter, 0),
                        'month', COALESCE(month_spend.month, 0)
                ) AS spend
	FROM person
	FULL OUTER JOIN year_income ON person.username = year_income.username
	FULL OUTER JOIN quarter_income ON person.username = quarter_income.username
	FULL OUTER JOIN month_income ON person.username = month_income.username
	FULL OUTER JOIN year_spend ON person.username = year_spend.username
	FULL OUTER JOIN quarter_spend ON person.username = quarter_spend.username
	FULL OUTER JOIN month_spend ON person.username = month_spend.username;
END;
$$ LANGUAGE plpgsql;



--
-- ROLES AND RIGHTS
--

CREATE ROLE child;
CREATE ROLE parent WITH CREATEROLE;
CREATE ROLE super_parent WITH CREATEROLE;

GRANT SELECT, INSERT ON person TO super_parent;
GRANT SELECT, INSERT ON person TO parent;
GRANT SELECT ON person TO child;
GRANT INSERT, SELECT, DELETE ON TABLE account TO child;
GRANT INSERT, SELECT, DELETE ON TABLE account TO parent;
GRANT INSERT, SELECT, DELETE ON TABLE account TO super_parent;

GRANT SELECT ON TABLE income_category TO child;
GRANT SELECT ON TABLE income_category TO parent;
GRANT SELECT ON TABLE income_category TO super_parent;
GRANT SELECT ON TABLE spend_category TO child;
GRANT SELECT ON TABLE spend_category TO parent;
GRANT SELECT ON TABLE spend_category TO super_parent;

GRANT ALL ON TABLE income TO child;
GRANT ALL ON TABLE income TO parent;
GRANT ALL ON TABLE income TO super_parent;
GRANT ALL ON TABLE recurring_income TO child;
GRANT ALL ON TABLE recurring_income TO parent;
GRANT ALL ON TABLE recurring_income TO super_parent;
GRANT ALL ON TABLE spend TO child;
GRANT ALL ON TABLE spend TO parent;
GRANT ALL ON TABLE spend TO super_parent;
GRANT ALL ON TABLE recurring_spend TO child;
GRANT ALL ON TABLE recurring_spend TO parent;
GRANT ALL ON TABLE recurring_spend TO super_parent;

GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE account_view TO super_parent;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE account_view TO child;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE account_view TO parent;

GRANT SELECT ON TABLE transactions_view TO super_parent;
GRANT SELECT ON TABLE transactions_view TO child;
GRANT SELECT ON TABLE transactions_view TO parent;

GRANT SELECT ON TABLE recurring_transactions_view TO super_parent;
GRANT SELECT ON TABLE recurring_transactions_view TO child;
GRANT SELECT ON TABLE recurring_transactions_view TO parent;

GRANT EXECUTE ON FUNCTION create_account(text) TO child;
GRANT EXECUTE ON FUNCTION create_account(text) TO parent;
GRANT EXECUTE ON FUNCTION create_account(text) TO super_parent;

GRANT EXECUTE ON FUNCTION get_my_role() TO child;
GRANT EXECUTE ON FUNCTION get_my_role() TO parent;
GRANT EXECUTE ON FUNCTION get_my_role() TO super_parent;

GRANT EXECUTE ON FUNCTION get_parent() TO super_parent;
GRANT EXECUTE ON FUNCTION create_parent(username TEXT, passwrd TEXT) TO super_parent;
GRANT EXECUTE ON FUNCTION create_child(username TEXT, passwrd TEXT) TO parent;
GRANT EXECUTE ON FUNCTION create_child(username TEXT, passwrd TEXT) TO super_parent;

GRANT EXECUTE ON FUNCTION transactions_by_account_id (accountId UUID) TO super_parent;
GRANT EXECUTE ON FUNCTION transactions_by_account_id (accountId UUID) TO parent;
GRANT EXECUTE ON FUNCTION transactions_by_account_id (accountId UUID) TO child;

INSERT INTO Income_Category (title)
	VALUES
	('Salary'),
	('Bonus'),
	('Interest'),
	('Dividends'),
	('Rental Income'),
	('Gifts'),
	('Capital Gains'),
	('Self-Employment Income'),
	('Other'),
	('Social Security');

INSERT INTO spend_category (title)
	VALUES
	('Food'),
	('Health'),
	('Entertainment'),
	('Travel'),
	('Vehicle'),
	('Online subscription'),
	('House'),
	('Taxes'),
	('Utilities'),
	('Legal documents'),
	('One-time'),
	('Unexpected'),
	('Personal'),
	('Other');

INSERT INTO time_gap_type (title)
	VALUES
	('Day'),
	('Week'),
	('Month'),
	('Year');
```
