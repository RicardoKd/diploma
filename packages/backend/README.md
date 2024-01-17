# Server

# DB creation

```sql
--
-- TABLES
--

CREATE TABLE person (
        _id SERIAL PRIMARY KEY,
	username Text NOT NULL UNIQUE );

CREATE TABLE account (
	_id SERIAL PRIMARY KEY,
	title Text NOT NULL,
	username Text NOT NULL REFERENCES person(username) ON DELETE Cascade);

CREATE TABLE time_gap_type (
	_id SERIAL PRIMARY KEY,
	title Text NOT NULL UNIQUE );

CREATE TABLE income_category ( 	_id SERIAL PRIMARY KEY,
	title Text NOT NULL UNIQUE );

CREATE TABLE income (
	_id SERIAL PRIMARY KEY,
	notes Text NOT NULL,
	record_date Date NOT NULL CHECK (record_date <= CURRENT_DATE),
	amount_of_money Money NOT NULL CHECK (amount_of_money::Numeric > 0),
	account_id Integer NOT NULL REFERENCES account(_id) ON DELETE Cascade,
	category_id Integer NOT NULL REFERENCES income_category(_id) ON DELETE Cascade );

CREATE TABLE recurring_income (
	_id SERIAL PRIMARY KEY,
	notes Text NOT NULL,
	end_date Date NOT NULL CHECK (end_date >= CURRENT_DATE),
	start_date Date NOT NULL,
	amount_of_money Money NOT NULL CHECK (amount_of_money::Numeric > 0),
	time_gap_type_value Integer NOT NULL CHECK (time_gap_type_value::Numeric > 0),
	time_gap_type_id Integer NOT NULL REFERENCES time_gap_type(_id) ON DELETE Cascade,
	category_id Integer NOT NULL REFERENCES income_category(_id) ON DELETE Cascade,
	account_id Integer NOT NULL REFERENCES account(_id) ON DELETE Cascade );

CREATE TABLE spend_category (
	_id SERIAL PRIMARY KEY,
	title Text NOT NULL UNIQUE );

CREATE TABLE spend (
	_id SERIAL PRIMARY KEY,
	notes Text NOT NULL,
	record_date Date NOT NULL CHECK (record_date <= CURRENT_DATE),
	amount_of_money Money NOT NULL CHECK (amount_of_money::Numeric > 0),
	account_id Integer NOT NULL REFERENCES account(_id) ON DELETE Cascade,
	category_id Integer NOT NULL REFERENCES spend_category(_id) ON DELETE Cascade );

CREATE TABLE recurring_spend (
	_id SERIAL PRIMARY KEY,
	notes Text NOT NULL,
	end_date Date NOT NULL CHECK (end_date >= CURRENT_DATE),
	start_date Date NOT NULL,
	amount_of_money Money NOT NULL CHECK (amount_of_money::Numeric > 0),
	time_gap_type_value Integer NOT NULL CHECK (time_gap_type_value::Numeric > 0),
	time_gap_type_id Integer NOT NULL REFERENCES time_gap_type(_id) ON DELETE Cascade,
	category_id Integer NOT NULL REFERENCES spend_category(_id) ON DELETE Cascade,
	account_id Integer NOT NULL REFERENCES account(_id) ON DELETE Cascade );


--
-- VIEWS
--

CREATE OR REPLACE VIEW account_view AS
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
) select account._id, account.title,
	json_build_object('year', year_income.year, 'quarter', quarter_income.quarter, 'month', month_income.month) as income,
	json_build_object('year', year_spend.year, 'quarter', quarter_spend.quarter, 'month', month_spend.month) as spend
	from account
	full outer join year_income on account._id = year_income.account_id
	full outer join quarter_income on account._id = quarter_income.account_id
	full outer join month_income on account._id = month_income.account_id
	full outer join year_spend on account._id = year_spend.account_id
	full outer join quarter_spend on account._id = quarter_spend.account_id
	full outer join month_spend on account._id = month_spend.account_id
	WHERE account.username = current_user;



CREATE OR REPLACE VIEW transactions_view AS
	with all_income_and_spend as (
		SELECT  income._id,
			income.notes,
			income.account_id,
			income.record_date::timestamp without time zone AT TIME ZONE 'UTC' AS record_date,
			income.amount_of_money::numeric,
			json_build_object('_id', income_category._id, 'title', income_category.title)::text AS category,
			'income' AS type
		FROM income
		JOIN income_category ON income_category._id = income.category_id
		where income.account_id = account_id
		UNION
		SELECT	spend._id,
			spend.notes,
			spend.account_id,
			spend.record_date::timestamp without time zone AT TIME ZONE 'UTC' AS record_date,
			0 - spend.amount_of_money::numeric as amount_of_money,
			json_build_object('_id', spend_category._id, 'title', spend_category.title)::text AS category,
			'spend' AS type
		FROM spend
		JOIN spend_category ON spend_category._id = spend.category_id
		where spend.account_id = account_id
	)	select
		all_income_and_spend._id,
		all_income_and_spend.notes,
		all_income_and_spend.account_id,
		all_income_and_spend.record_date,
		all_income_and_spend.amount_of_money::numeric,
		all_income_and_spend.category::json,
		all_income_and_spend.type
	from all_income_and_spend
	join account ON account._id = all_income_and_spend.account_id
	WHERE account.username = current_user
	ORDER BY record_date;


CREATE OR REPLACE VIEW recurring_spend_view AS
	SELECT
		recurring_spend._id,
		notes,
		end_date,
		start_date,
		amount_of_money::numeric,
		time_gap_type_value,
		json_build_object('_id', spend_category._id, 'title', spend_category.title) AS category,
		json_build_object('_id', time_gap_type._id, 'title', time_gap_type.title) AS time_gap_type,
		account_id
	from recurring_spend
	JOIN account ON account._id = recurring_spend.account_id
	JOIN spend_category ON spend_category._id = recurring_spend.category_id
	JOIN time_gap_type ON time_gap_type._id = recurring_spend.time_gap_type_id
	WHERE account.username = current_user
	ORDER BY start_date;


CREATE OR REPLACE VIEW recurring_income_view AS
	SELECT
		recurring_income._id,
		notes,
		end_date,
		start_date,
		amount_of_money::numeric,
		time_gap_type_value,
		json_build_object('_id', income_category._id, 'title', income_category.title) AS category,
		json_build_object('_id', time_gap_type._id, 'title', time_gap_type.title) AS time_gap_type,
		account_id
	from recurring_income
	JOIN account ON account._id = recurring_income.account_id
	JOIN income_category ON income_category._id = recurring_income.category_id
	JOIN time_gap_type ON time_gap_type._id = recurring_income.time_gap_type_id
	WHERE account.username = current_user
	ORDER BY start_date;


--
-- FUNCTIONS AND TRIGGERS
--

CREATE OR REPLACE FUNCTION check_spend_limit()
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
CREATE TRIGGER block_exceeding_spend_limit
BEFORE INSERT OR UPDATE ON Spend
FOR EACH ROW
EXECUTE FUNCTION check_spend_limit();



CREATE OR REPLACE FUNCTION category_percentage(table_type TEXT, months_to_include INTEGER, before_date DATE, accountId INTEGER)
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
    FULL OUTER JOIN tbc ON tbc.category_id = sc._id
    GROUP BY sc._id
    ORDER BY sc._id;

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
    FULL OUTER JOIN tbc ON tbc.category_id = ic._id
    GROUP BY ic._id
    ORDER BY ic._id;
  ELSE
    RAISE EXCEPTION 'Invalid type: %', table_type;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_account(title_name TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO account (title, username)
  VALUES (title_name, current_user);
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

CREATE OR REPLACE FUNCTION get_parent()
    RETURNS TABLE(user_name name) AS $$
BEGIN
    RETURN QUERY
		SELECT r.rolname AS user_name
		FROM pg_roles r
		JOIN pg_auth_members m ON r.oid = m.member
		JOIN pg_roles p ON m.roleid = p.oid
		WHERE p.rolname = 'parent';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION transactions_by_account_id (accountId INTEGER)
RETURNS TABLE(_id integer, notes text, account_id integer, record_date timestamp with time zone, amount_of_money numeric, category json, type text) AS $$
BEGIN
	RETURN QUERY
	SELECT * FROM transactions_view
	WHERE transactions_view.account_id = accountId
	ORDER BY record_date DESC;
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

--
-- ROLES AND RIGHTS
--

CREATE ROLE child;
CREATE ROLE parent WITH CREATEROLE;
CREATE ROLE super_parent WITH CREATEROLE;

GRANT INSERT ON person TO super_parent;
GRANT INSERT ON person TO parent;
GRANT INSERT, SELECT ON TABLE account TO child;
GRANT INSERT, SELECT ON TABLE account TO parent;
GRANT INSERT, SELECT ON TABLE account TO super_parent;

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

GRANT SELECT ON TABLE recurring_spend_view TO super_parent;
GRANT SELECT ON TABLE recurring_spend_view TO child;
GRANT SELECT ON TABLE recurring_spend_view TO parent;

GRANT SELECT ON TABLE recurring_income_view TO super_parent;
GRANT SELECT ON TABLE recurring_income_view TO child;
GRANT SELECT ON TABLE recurring_income_view TO parent;

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

GRANT EXECUTE ON FUNCTION transactions_by_account_id (accountId integer) TO super_parent;
GRANT EXECUTE ON FUNCTION transactions_by_account_id (accountId integer) TO parent;
GRANT EXECUTE ON FUNCTION transactions_by_account_id (accountId integer) TO child;

GRANT SELECT, USAGE ON SEQUENCE account__id_seq TO child;
GRANT SELECT, USAGE ON SEQUENCE account__id_seq TO parent;
GRANT SELECT, USAGE ON SEQUENCE account__id_seq TO super_parent;
GRANT SELECT, USAGE ON SEQUENCE income__id_seq TO child;
GRANT SELECT, USAGE ON SEQUENCE income__id_seq TO parent;
GRANT SELECT, USAGE ON SEQUENCE income__id_seq TO super_parent;

GRANT SELECT, USAGE ON SEQUENCE recurring_income__id_seq TO child;
GRANT SELECT, USAGE ON SEQUENCE recurring_income__id_seq TO parent;
GRANT SELECT, USAGE ON SEQUENCE recurring_income__id_seq TO super_parent;

GRANT SELECT, USAGE ON SEQUENCE recurring_spend__id_seq TO child;
GRANT SELECT, USAGE ON SEQUENCE recurring_spend__id_seq TO parent;
GRANT SELECT, USAGE ON SEQUENCE recurring_spend__id_seq TO super_parent;

GRANT SELECT, USAGE ON SEQUENCE spend__id_seq TO child;
GRANT SELECT, USAGE ON SEQUENCE spend__id_seq TO parent;
GRANT SELECT, USAGE ON SEQUENCE spend__id_seq TO super_parent;

GRANT USAGE, SELECT ON SEQUENCE person__id_seq TO super_parent;
GRANT SELECT, USAGE ON SEQUENCE person__id_seq TO parent;

```
