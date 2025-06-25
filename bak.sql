-- Database "dormy" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: dormy; Type: DATABASE; Schema: -; Owner: ionize13
--

CREATE DATABASE dormy WITH TEMPLATE = template0 ENCODING = 'SQL_ASCII' LOCALE_PROVIDER = libc LOCALE = 'C';


ALTER DATABASE dormy OWNER TO ionize13;

\connect dormy

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: dormy; Type: DATABASE PROPERTIES; Schema: -; Owner: ionize13
--

ALTER DATABASE dormy SET search_path TO 'public', 'dormy';


\connect dormy

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: dormy; Type: SCHEMA; Schema: -; Owner: ionize13
--

CREATE SCHEMA dormy;


ALTER SCHEMA dormy OWNER TO ionize13;

--
-- Name: apartments_receiving_account_type; Type: TYPE; Schema: dormy; Owner: ionize13
--

CREATE TYPE dormy.apartments_receiving_account_type AS ENUM (
    'bank',
    'promptpay'
);


ALTER TYPE dormy.apartments_receiving_account_type OWNER TO ionize13;

--
-- Name: reports_status; Type: TYPE; Schema: dormy; Owner: ionize13
--

CREATE TYPE dormy.reports_status AS ENUM (
    'pending',
    'done',
    'cancel'
);


ALTER TYPE dormy.reports_status OWNER TO ionize13;

--
-- Name: reports_typeofreport; Type: TYPE; Schema: dormy; Owner: ionize13
--

CREATE TYPE dormy.reports_typeofreport AS ENUM (
    'cleaning',
    'repairing',
    'moving-out',
    'emergency',
    'other'
);


ALTER TYPE dormy.reports_typeofreport OWNER TO ionize13;

--
-- Name: rooms_availability_status; Type: TYPE; Schema: dormy; Owner: ionize13
--

CREATE TYPE dormy.rooms_availability_status AS ENUM (
    'occupied',
    'vacant',
    'under_maintenance'
);


ALTER TYPE dormy.rooms_availability_status OWNER TO ionize13;

--
-- Name: utility_bills_service_type; Type: TYPE; Schema: dormy; Owner: ionize13
--

CREATE TYPE dormy.utility_bills_service_type AS ENUM (
    'electricity',
    'water'
);


ALTER TYPE dormy.utility_bills_service_type OWNER TO ionize13;

--
-- Name: on_update_current_timestamp_properties(); Type: FUNCTION; Schema: dormy; Owner: ionize13
--

CREATE FUNCTION dormy.on_update_current_timestamp_properties() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION dormy.on_update_current_timestamp_properties() OWNER TO ionize13;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: apartments; Type: TABLE; Schema: dormy; Owner: postgres
--

CREATE TABLE dormy.apartments (
    apartment_name character varying(255) NOT NULL,
    phone_number character varying(20) DEFAULT NULL::character varying,
    business_type character varying(100) DEFAULT NULL::character varying,
    apartment_address text,
    createdat timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    apartment_id bigint NOT NULL,
    bill_date bigint NOT NULL,
    paymentdue_date bigint NOT NULL,
    email_address character varying(255) DEFAULT NULL::character varying,
    receiving_account_type dormy.apartments_receiving_account_type,
    receiving_account_id bigint,
    owner_id bigint
);


ALTER TABLE dormy.apartments OWNER TO postgres;

--
-- Name: apartments_apartment_id_seq; Type: SEQUENCE; Schema: dormy; Owner: postgres
--

CREATE SEQUENCE dormy.apartments_apartment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE dormy.apartments_apartment_id_seq OWNER TO postgres;

--
-- Name: apartments_apartment_id_seq; Type: SEQUENCE OWNED BY; Schema: dormy; Owner: postgres
--

ALTER SEQUENCE dormy.apartments_apartment_id_seq OWNED BY dormy.apartments.apartment_id;


--
-- Name: bankaccounts; Type: TABLE; Schema: dormy; Owner: ionize13
--

CREATE TABLE dormy.bankaccounts (
    bank_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    bank_number character varying(100) NOT NULL,
    owner_id bigint NOT NULL
);


ALTER TABLE dormy.bankaccounts OWNER TO ionize13;

--
-- Name: owners; Type: TABLE; Schema: dormy; Owner: ionize13
--

CREATE TABLE dormy.owners (
    id bigint NOT NULL,
    phone character varying(20) DEFAULT NULL::character varying,
    have_apartments boolean DEFAULT false NOT NULL,
    name character varying(255) DEFAULT NULL::character varying,
    email character varying(255) DEFAULT NULL::character varying,
    default_apartment_id bigint
);


ALTER TABLE dormy.owners OWNER TO ionize13;

--
-- Name: owners_id_seq; Type: SEQUENCE; Schema: dormy; Owner: ionize13
--

CREATE SEQUENCE dormy.owners_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE dormy.owners_id_seq OWNER TO ionize13;

--
-- Name: owners_id_seq; Type: SEQUENCE OWNED BY; Schema: dormy; Owner: ionize13
--

ALTER SEQUENCE dormy.owners_id_seq OWNED BY dormy.owners.id;


--
-- Name: packages; Type: TABLE; Schema: dormy; Owner: ionize13
--

CREATE TABLE dormy.packages (
    id bigint NOT NULL,
    room_number character varying(50) NOT NULL,
    owner_name character varying(255) DEFAULT NULL::character varying,
    tracking_code character varying(100) NOT NULL,
    delivery_status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    delivered_at timestamp with time zone
);


ALTER TABLE dormy.packages OWNER TO ionize13;

--
-- Name: packages_id_seq; Type: SEQUENCE; Schema: dormy; Owner: ionize13
--

CREATE SEQUENCE dormy.packages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE dormy.packages_id_seq OWNER TO ionize13;

--
-- Name: packages_id_seq; Type: SEQUENCE OWNED BY; Schema: dormy; Owner: ionize13
--

ALTER SEQUENCE dormy.packages_id_seq OWNED BY dormy.packages.id;


--
-- Name: promptpays; Type: TABLE; Schema: dormy; Owner: ionize13
--

CREATE TABLE dormy.promptpays (
    promptpay_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(100) DEFAULT NULL::character varying,
    national_id character varying(100) DEFAULT NULL::character varying,
    owner_id character varying(255) NOT NULL
);


ALTER TABLE dormy.promptpays OWNER TO ionize13;

--
-- Name: promptpays_promptpay_id_seq; Type: SEQUENCE; Schema: dormy; Owner: ionize13
--

CREATE SEQUENCE dormy.promptpays_promptpay_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE dormy.promptpays_promptpay_id_seq OWNER TO ionize13;

--
-- Name: promptpays_promptpay_id_seq; Type: SEQUENCE OWNED BY; Schema: dormy; Owner: ionize13
--

ALTER SEQUENCE dormy.promptpays_promptpay_id_seq OWNED BY dormy.promptpays.promptpay_id;


--
-- Name: properties; Type: TABLE; Schema: dormy; Owner: ionize13
--

CREATE TABLE dormy.properties (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone
);


ALTER TABLE dormy.properties OWNER TO ionize13;

--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: dormy; Owner: ionize13
--

CREATE SEQUENCE dormy.properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE dormy.properties_id_seq OWNER TO ionize13;

--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: dormy; Owner: ionize13
--

ALTER SEQUENCE dormy.properties_id_seq OWNED BY dormy.properties.id;


--
-- Name: rentbills; Type: TABLE; Schema: dormy; Owner: ionize13
--

CREATE TABLE dormy.rentbills (
    id bigint NOT NULL,
    tenant_id bigint NOT NULL,
    amount numeric(10,2) NOT NULL,
    due_date date NOT NULL,
    paid boolean DEFAULT false,
    payment_date date
);


ALTER TABLE dormy.rentbills OWNER TO ionize13;

--
-- Name: rentbills_id_seq; Type: SEQUENCE; Schema: dormy; Owner: ionize13
--

CREATE SEQUENCE dormy.rentbills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE dormy.rentbills_id_seq OWNER TO ionize13;

--
-- Name: rentbills_id_seq; Type: SEQUENCE OWNED BY; Schema: dormy; Owner: ionize13
--

ALTER SEQUENCE dormy.rentbills_id_seq OWNED BY dormy.rentbills.id;


--
-- Name: reports; Type: TABLE; Schema: dormy; Owner: ionize13
--

CREATE TABLE dormy.reports (
    id bigint NOT NULL,
    typeofreport dormy.reports_typeofreport NOT NULL,
    filename character varying(255) NOT NULL,
    detail text NOT NULL,
    "user" character varying(255) NOT NULL,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status dormy.reports_status DEFAULT 'pending'::dormy.reports_status NOT NULL
);


ALTER TABLE dormy.reports OWNER TO ionize13;

--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: dormy; Owner: ionize13
--

CREATE SEQUENCE dormy.reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE dormy.reports_id_seq OWNER TO ionize13;

--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: dormy; Owner: ionize13
--

ALTER SEQUENCE dormy.reports_id_seq OWNED BY dormy.reports.id;


--
-- Name: rooms; Type: TABLE; Schema: dormy; Owner: ionize13
--

CREATE TABLE dormy.rooms (
    id bigint NOT NULL,
    apartment_id bigint NOT NULL,
    room_number character varying(50) NOT NULL,
    availability_status dormy.rooms_availability_status DEFAULT 'vacant'::dormy.rooms_availability_status NOT NULL,
    floor_number bigint DEFAULT '1'::bigint NOT NULL,
    rent_late_fee numeric(10,2) DEFAULT 0.00,
    rent_lease_id bigint,
    rent_is_paid boolean DEFAULT false,
    rent_sent boolean DEFAULT false,
    rent_amount bigint
);


ALTER TABLE dormy.rooms OWNER TO ionize13;

--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: dormy; Owner: ionize13
--

CREATE SEQUENCE dormy.rooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE dormy.rooms_id_seq OWNER TO ionize13;

--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: dormy; Owner: ionize13
--

ALTER SEQUENCE dormy.rooms_id_seq OWNED BY dormy.rooms.id;


--
-- Name: tenants; Type: TABLE; Schema: dormy; Owner: ionize13
--

CREATE TABLE dormy.tenants (
    id bigint NOT NULL,
    clerk_user_id character varying(255) DEFAULT '1'::character varying NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20) DEFAULT NULL::character varying,
    move_in_date date,
    lease_start date,
    lease_end date,
    monthly_rent numeric(10,2) DEFAULT NULL::numeric,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    apartment_id bigint NOT NULL,
    room_number character varying(50) NOT NULL
);


ALTER TABLE dormy.tenants OWNER TO ionize13;

--
-- Name: tenants_id_seq; Type: SEQUENCE; Schema: dormy; Owner: ionize13
--

CREATE SEQUENCE dormy.tenants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE dormy.tenants_id_seq OWNER TO ionize13;

--
-- Name: tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: dormy; Owner: ionize13
--

ALTER SEQUENCE dormy.tenants_id_seq OWNED BY dormy.tenants.id;


--
-- Name: users; Type: TABLE; Schema: dormy; Owner: ionize13
--

CREATE TABLE dormy.users (
    user_id bigint NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20) DEFAULT NULL::character varying,
    password_hash character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    clerk_id character varying(255) NOT NULL
);


ALTER TABLE dormy.users OWNER TO ionize13;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: dormy; Owner: ionize13
--

CREATE SEQUENCE dormy.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE dormy.users_user_id_seq OWNER TO ionize13;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: dormy; Owner: ionize13
--

ALTER SEQUENCE dormy.users_user_id_seq OWNED BY dormy.users.user_id;


--
-- Name: utility_bills; Type: TABLE; Schema: dormy; Owner: ionize13
--

CREATE TABLE dormy.utility_bills (
    utility_id bigint NOT NULL,
    tenant_id bigint NOT NULL,
    service_type dormy.utility_bills_service_type NOT NULL,
    amount numeric(10,2) NOT NULL,
    due_date date NOT NULL,
    consumption_units bigint,
    current_meter_reading numeric(10,2) DEFAULT NULL::numeric,
    previous_meter_reading numeric(10,2) DEFAULT NULL::numeric,
    meter_reading_date date,
    is_paid boolean DEFAULT false,
    apartment_id bigint NOT NULL
);


ALTER TABLE dormy.utility_bills OWNER TO ionize13;

--
-- Name: utility_bills_utility_id_seq; Type: SEQUENCE; Schema: dormy; Owner: ionize13
--

CREATE SEQUENCE dormy.utility_bills_utility_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE dormy.utility_bills_utility_id_seq OWNER TO ionize13;

--
-- Name: utility_bills_utility_id_seq; Type: SEQUENCE OWNED BY; Schema: dormy; Owner: ionize13
--

ALTER SEQUENCE dormy.utility_bills_utility_id_seq OWNED BY dormy.utility_bills.utility_id;


--
-- Name: apartments apartment_id; Type: DEFAULT; Schema: dormy; Owner: postgres
--

ALTER TABLE ONLY dormy.apartments ALTER COLUMN apartment_id SET DEFAULT nextval('dormy.apartments_apartment_id_seq'::regclass);


--
-- Name: owners id; Type: DEFAULT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.owners ALTER COLUMN id SET DEFAULT nextval('dormy.owners_id_seq'::regclass);


--
-- Name: packages id; Type: DEFAULT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.packages ALTER COLUMN id SET DEFAULT nextval('dormy.packages_id_seq'::regclass);


--
-- Name: promptpays promptpay_id; Type: DEFAULT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.promptpays ALTER COLUMN promptpay_id SET DEFAULT nextval('dormy.promptpays_promptpay_id_seq'::regclass);


--
-- Name: properties id; Type: DEFAULT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.properties ALTER COLUMN id SET DEFAULT nextval('dormy.properties_id_seq'::regclass);


--
-- Name: rentbills id; Type: DEFAULT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.rentbills ALTER COLUMN id SET DEFAULT nextval('dormy.rentbills_id_seq'::regclass);


--
-- Name: reports id; Type: DEFAULT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.reports ALTER COLUMN id SET DEFAULT nextval('dormy.reports_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.rooms ALTER COLUMN id SET DEFAULT nextval('dormy.rooms_id_seq'::regclass);


--
-- Name: tenants id; Type: DEFAULT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.tenants ALTER COLUMN id SET DEFAULT nextval('dormy.tenants_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.users ALTER COLUMN user_id SET DEFAULT nextval('dormy.users_user_id_seq'::regclass);


--
-- Name: utility_bills utility_id; Type: DEFAULT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.utility_bills ALTER COLUMN utility_id SET DEFAULT nextval('dormy.utility_bills_utility_id_seq'::regclass);


--
-- Data for Name: apartments; Type: TABLE DATA; Schema: dormy; Owner: postgres
--

COPY dormy.apartments (apartment_name, phone_number, business_type, apartment_address, createdat, apartment_id, bill_date, paymentdue_date, email_address, receiving_account_type, receiving_account_id, owner_id) FROM stdin;
dorm test	0987654321	personal	123 moo 11	2025-02-24 22:31:31+07	1	1	4	iomize.thaopech@gmail.com	\N	\N	\N
hong kai	0987654321	personal	123 moo 11	2025-02-24 22:37:18+07	2	1	4	iomize.thaopech@gmail.com	\N	\N	\N
more test	0987654321	personal	234t moo 12	2025-02-24 23:16:31+07	3	1	5	iomize.thaopech@gmail.com	\N	\N	\N
test more 	0987654321	personal	234 moo 12	2025-02-24 23:17:12+07	4	1	5	iomize.thaopech@gmail.com	\N	\N	\N
more test123	0987654321	personal	234 moo 234	2025-02-24 23:20:23+07	5	1	7	iomize.thaopech@gmail.com	\N	\N	\N
more test	123456789	company	45678	2025-02-24 23:24:28+07	6	1	6	iomzajdfyuio	\N	\N	\N
Sunrise Apartments	555-111-2222	Residential	123 Main St, Cityville	2025-02-25 05:48:26+07	7	1	5	sunrise@example.com	\N	\N	\N
Maple Residences	555-333-4444	Residential	456 Oak St, Townsville	2025-02-25 05:48:26+07	8	10	15	maple@example.com	\N	\N	\N
sunshine 1	0987321654	personal	123 หมู่ 999 อำเภอ ...	2025-02-27 20:16:50+07	9	1	4	insee.t@kkumail.com	\N	\N	\N
sunshine 1	0987654321	personal	123 หมู่ 999 ถนน ........	2025-02-27 20:24:23+07	10	1	4	insee.t@kkumail.com	\N	\N	\N
sunshine 1	0987654321	personal	123 หมู่ 9999 ถนน .....	2025-02-27 20:27:22+07	11	1	4	insee.t@kkumail.com	\N	\N	\N
aosu	0987654321	personal	oasiuf0129	2025-03-02 18:42:17+07	12	1	4	insee134@gmail.com	\N	\N	\N
\.


--
-- Data for Name: bankaccounts; Type: TABLE DATA; Schema: dormy; Owner: ionize13
--

COPY dormy.bankaccounts (bank_id, name, bank_number, owner_id) FROM stdin;
\.


--
-- Data for Name: owners; Type: TABLE DATA; Schema: dormy; Owner: ionize13
--

COPY dormy.owners (id, phone, have_apartments, name, email, default_apartment_id) FROM stdin;
1	\N	t	\N	\N	1
2	987-654-3210	t	Jane Smith	jane.smith@example.com	\N
3	\N	t	\N	\N	\N
4	\N	t	\N	\N	\N
5	\N	t	\N	\N	\N
8	\N	t	\N	\N	\N
\.


--
-- Data for Name: packages; Type: TABLE DATA; Schema: dormy; Owner: ionize13
--

COPY dormy.packages (id, room_number, owner_name, tracking_code, delivery_status, delivered_at) FROM stdin;
1	A101	สมชาย นามสกุล	TRACK123456	done	\N
2	B202	สุกัญญา หวังดี	TRACK987654	done	2025-02-14 10:00:00+07
3	C303	ณัฐพล คงใจ	TRACK192837	done	\N
4	D404	พิมพ์ชนก ยิ้มยิน	TRACK564738	done	2025-02-14 11:30:00+07
5	E505	บุญสม รักดี	TRACK102938	done	\N
6	F606	นวพล ภูมิใจ	TRACK847362	done	2025-02-14 12:15:00+07
7	G707	วรรณา คำตระกูล	TRACK562738	done	\N
8	H808	เกษม สอนแก้ว	TRACK193847	done	2025-02-14 13:00:00+07
9	I909	ธัญญา วีระบุญ	TRACK847572	done	\N
10	J1010	ธนาวัฒน์ ปานทอง	TRACK736281	done	2025-02-14 14:00:00+07
14	B202	สุกัญญา หวังดี	TRACK987654	pending	\N
\.


--
-- Data for Name: promptpays; Type: TABLE DATA; Schema: dormy; Owner: ionize13
--

COPY dormy.promptpays (promptpay_id, name, phone, national_id, owner_id) FROM stdin;
1	อินทรี ท้าวเพชร	0943986668	\N	user_2tTwhVoQ5HzG2UYZVO0MsaqxKDW
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: dormy; Owner: ionize13
--

COPY dormy.properties (id, name, address, created_at, updated_at) FROM stdin;
1	ที่พักอาศัย ก	12 ถนนราชดำริ	2025-02-23 20:15:14+07	2025-02-23 20:15:14+07
2	คอนโด เอ	105 ซอยสุขุมวิท 23	2025-02-23 20:15:14+07	2025-02-23 20:15:14+07
3	บ้าน บี	56 ถนนเจริญกรุง	2025-02-23 20:15:14+07	2025-02-23 20:15:14+07
4	อพาร์ทเมนท์ ซี	301 ซอยลาดพร้าว 101	2025-02-23 20:15:14+07	2025-02-23 20:15:14+07
5	วิลล่า ดี	70 ถนนเพชรบุรีตัดใหม่	2025-02-23 20:15:14+07	2025-02-23 20:15:14+07
6	โฮมสเตย์ อี	123 หมู่ 5 ตำบลบางรัก	2025-02-23 20:15:14+07	2025-02-23 20:15:14+07
7	แมนชั่น เอฟ	22 ถนนราชวิถี	2025-02-23 20:15:14+07	2025-02-23 20:15:14+07
8	โฮเทล จี	99 ซอยอ่อนนุช 17	2025-02-23 20:15:14+07	2025-02-23 20:15:14+07
9	รีสอร์ต เอช	404 ถนนพระสุเมรุ	2025-02-23 20:15:14+07	2025-02-23 20:15:14+07
10	บูทีคโฮเต็ล ไอ	15 ซอยติวานนท์ 3	2025-02-23 20:15:14+07	2025-02-23 20:15:14+07
\.


--
-- Data for Name: rentbills; Type: TABLE DATA; Schema: dormy; Owner: ionize13
--

COPY dormy.rentbills (id, tenant_id, amount, due_date, paid, payment_date) FROM stdin;
1	17	1000.00	2025-03-04	f	\N
2	19	1000.00	2025-03-04	f	\N
3	1	1000.00	2025-03-04	f	\N
4	2	1000.00	2025-03-04	f	\N
5	3	1000.00	2025-03-04	f	\N
6	4	1000.00	2025-03-04	f	\N
7	5	1000.00	2025-03-04	f	\N
8	6	1000.00	2025-03-04	f	\N
9	7	1000.00	2025-03-04	f	\N
10	8	1000.00	2025-03-04	f	\N
11	9	1000.00	2025-03-04	f	\N
12	10	1000.00	2025-03-04	f	\N
13	1	2000.00	2025-03-04	f	\N
14	2	2000.00	2025-03-04	f	\N
15	3	2000.00	2025-03-04	f	\N
16	4	2000.00	2025-03-04	f	\N
17	5	2000.00	2025-03-04	f	\N
18	6	2000.00	2025-03-04	f	\N
19	7	2000.00	2025-03-04	f	\N
20	8	2000.00	2025-03-04	f	\N
21	9	2000.00	2025-03-04	f	\N
22	10	2000.00	2025-03-04	f	\N
23	113	10000.00	2025-03-04	f	\N
24	113	10000.00	2025-03-04	f	\N
25	118	3000.00	2025-03-04	f	\N
26	118	4000.00	2025-03-04	f	\N
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: dormy; Owner: ionize13
--

COPY dormy.reports (id, typeofreport, filename, detail, "user", "timestamp", status) FROM stdin;
1	cleaning	report_cleaning_01.pdf	ขอให้ทำความสะอาดพื้นที่ส่วนกลางในอพาร์ตเมนต์	สมชาย นามสกุล	2025-02-14 10:00:00+07	pending
2	repairing	report_repair_01.pdf	ขอให้ซ่อมแซมไฟในห้องน้ำที่ไม่ติด	สุกัญญา หวังดี	2025-02-14 10:30:00+07	pending
3	moving-out	report_move_01.pdf	แจ้งย้ายออกจากอพาร์ตเมนต์ในวันที่ 1 มีนาคม	ณัฐพล คงใจ	2025-02-14 11:00:00+07	pending
4	emergency	report_emergency_01.pdf	ขอความช่วยเหลือเรื่องน้ำรั่วจากเพดานห้อง	พิมพ์ชนก ยิ้มยิน	2025-02-14 11:30:00+07	pending
5	cleaning	report_cleaning_02.pdf	ขอให้ทำความสะอาดห้องครัว	บุญสม รักดี	2025-02-14 12:00:00+07	pending
6	repairing	report_repair_02.pdf	ขอให้ซ่อมแซมระบบแอร์ที่ไม่ทำงาน	นวพล ภูมิใจ	2025-02-14 12:30:00+07	pending
7	moving-out	report_move_02.pdf	ขอแจ้งย้ายออกในวันที่ 15 กุมภาพันธ์	วรรณา คำตระกูล	2025-02-14 13:00:00+07	pending
8	emergency	report_emergency_02.pdf	ขอให้มาซ่อมประตูล็อคห้องที่เสีย	อรัญญา ศิริโสภา	2025-02-14 13:30:00+07	pending
9	cleaning	report_cleaning_03.pdf	ขอให้ทำความสะอาดบริเวณสวนหย่อม	พิมพ์ชนก แซ่ลี้	2025-02-14 14:00:00+07	pending
10	repairing	report_repair_03.pdf	ขอให้ซ่อมแซมท่อน้ำทิ้งในห้องน้ำที่อุดตัน	เกษม สอนแก้ว	2025-02-14 14:30:00+07	pending
11	moving-out	report_move_03.pdf	ขอแจ้งย้ายออกในวันที่ 28 กุมภาพันธ์	อาทิตย์ ทิพย์สวัสดิ์	2025-02-14 15:00:00+07	pending
12	emergency	report_emergency_03.pdf	ขอให้ช่วยซ่อมแซมไฟฟ้าขัดข้องในห้องโถง	ธนาวัฒน์ ปานทอง	2025-02-14 15:30:00+07	pending
13	cleaning	report_cleaning_04.pdf	ขอให้ทำความสะอาดห้องนั่งเล่น	ธัญญา วีระบุญ	2025-02-14 16:00:00+07	pending
14	repairing	report_repair_04.pdf	ขอให้ซ่อมแซมประตูไม้ที่เปิดไม่ได้	สมพงษ์ พิศวง	2025-02-14 16:30:00+07	pending
15	moving-out	report_move_04.pdf	ขอแจ้งย้ายออกในวันที่ 10 มีนาคม	บุญญาพร บัวจันทร์	2025-02-14 17:00:00+07	done
16	emergency	report_emergency_04.pdf	ขอให้ซ่อมแซมบันไดที่สึกหรอ	อังคณา โคตรหอม	2025-02-14 17:30:00+07	done
17	cleaning	report_cleaning_05.pdf	ขอให้ทำความสะอาดพื้นอาคารส่วนกลาง	สุภาภรณ์ ชูศักดิ์	2025-02-14 18:00:00+07	cancel
18	repairing	report_repair_05.pdf	ขอให้ซ่อมแซมกระจกที่แตกในห้องนอน	ดวงพร เตชะพร	2025-02-14 18:30:00+07	cancel
19	moving-out	report_move_05.pdf	ขอแจ้งย้ายออกในวันที่ 25 กุมภาพันธ์	ปกรณ์ เลิศวัฒนานันท์	2025-02-14 19:00:00+07	cancel
20	emergency	report_emergency_05.pdf	ขอให้ซ่อมแซมระบบประปาที่มีน้ำรั่ว	นงลักษณ์ ทองเปรม	2025-02-14 19:30:00+07	done
22	repairing	3033889874d0ad1d5da32783264fe0d3	สายฉีดชำระมีรอยรั่ว\r\n	สมชาย มั่งมี	2025-02-15 04:54:58+07	done
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: dormy; Owner: ionize13
--

COPY dormy.rooms (id, apartment_id, room_number, availability_status, floor_number, rent_late_fee, rent_lease_id, rent_is_paid, rent_sent, rent_amount) FROM stdin;
1	1	101	occupied	1	93.55	5679	f	f	2000
2	1	102	vacant	2	41.14	3873	t	f	2000
3	1	103	occupied	4	68.07	7745	t	f	2000
4	1	104	occupied	5	67.77	5439	f	f	2000
5	1	105	occupied	4	40.79	8731	t	f	2000
6	1	106	occupied	2	94.64	2807	f	f	2000
7	1	107	occupied	3	20.73	3952	t	f	2000
8	1	108	occupied	5	27.16	5030	t	f	2000
9	1	109	occupied	1	99.40	4034	f	f	2000
10	1	110	under_maintenance	3	25.60	2263	f	f	2000
11	1	111	occupied	4	83.29	8547	f	f	\N
12	1	112	occupied	1	28.85	1696	t	f	\N
13	1	113	occupied	1	85.69	9082	t	f	\N
14	1	114	occupied	3	5.79	3281	t	f	\N
15	1	115	occupied	2	5.21	5272	t	f	\N
16	1	116	occupied	5	48.16	2330	f	f	\N
17	1	117	occupied	1	81.97	6923	t	f	\N
18	1	118	occupied	1	84.81	2487	t	f	\N
19	1	119	occupied	1	33.01	5573	t	f	\N
20	1	120	occupied	4	79.49	3429	t	f	\N
21	1	121	occupied	2	70.72	7063	f	f	\N
22	1	122	occupied	3	11.11	7620	t	f	\N
23	1	123	occupied	4	82.06	1659	f	f	\N
24	1	124	occupied	2	83.25	6735	f	f	\N
25	1	125	occupied	5	47.25	7299	t	f	\N
26	1	126	vacant	2	78.08	3426	f	f	\N
27	1	127	occupied	4	41.75	5572	t	f	\N
28	1	128	occupied	3	39.42	2258	f	f	\N
29	1	129	occupied	1	72.24	5050	f	f	\N
30	1	130	under_maintenance	1	29.33	6785	f	f	\N
31	1	131	occupied	2	22.80	1622	f	f	\N
32	1	132	occupied	1	83.16	1520	t	f	\N
33	1	133	occupied	5	32.52	9903	f	f	\N
34	1	134	under_maintenance	5	74.52	7455	f	f	\N
35	1	135	occupied	3	41.26	2740	t	f	\N
36	1	136	occupied	2	28.37	7197	f	f	\N
37	1	137	occupied	5	41.71	4172	t	f	\N
38	1	138	occupied	1	75.11	6472	t	f	\N
39	1	139	occupied	2	92.23	3021	f	f	\N
40	1	140	occupied	4	60.41	4830	t	f	\N
41	1	141	under_maintenance	5	50.84	2523	f	f	\N
42	1	142	vacant	1	14.58	4329	f	f	\N
43	1	143	occupied	1	34.33	6442	f	f	\N
44	1	144	occupied	5	1.81	6782	f	f	\N
45	1	145	vacant	5	91.07	6742	t	f	\N
46	1	146	occupied	2	45.08	2464	t	f	\N
47	1	147	occupied	5	63.30	4212	f	f	\N
48	1	148	occupied	3	23.34	6346	f	f	\N
49	1	149	occupied	2	36.41	9734	f	f	\N
50	1	150	occupied	3	6.17	1369	f	f	\N
51	1	151	vacant	4	1.42	3093	t	f	\N
52	1	152	occupied	1	38.24	1642	f	f	\N
53	1	153	occupied	5	56.81	2888	f	f	\N
54	1	154	occupied	2	66.43	9332	t	f	\N
55	1	155	occupied	3	80.31	3906	t	f	\N
56	1	156	occupied	5	80.71	8293	f	f	\N
57	1	157	occupied	2	21.25	7688	f	f	\N
58	1	158	occupied	1	45.53	6089	f	f	\N
59	1	159	under_maintenance	2	91.31	3032	f	f	\N
60	1	160	occupied	2	54.38	5051	t	f	\N
61	1	161	occupied	2	30.28	7118	f	f	\N
62	1	162	occupied	3	63.48	4973	f	f	\N
63	1	163	occupied	3	21.69	2724	f	f	\N
64	1	164	occupied	3	99.14	5075	t	f	\N
65	1	165	occupied	3	15.35	2573	t	f	\N
66	1	166	occupied	5	13.92	2948	f	f	\N
67	1	167	occupied	4	62.95	8537	t	f	\N
68	1	168	occupied	4	8.41	6693	f	f	\N
69	1	169	occupied	2	30.96	1279	f	f	\N
70	1	170	occupied	3	85.50	9851	f	f	\N
71	1	171	occupied	3	85.59	6851	f	f	\N
72	1	172	vacant	1	20.05	5986	t	f	\N
73	1	173	occupied	5	74.26	1344	f	f	\N
74	1	174	occupied	1	59.05	8487	t	f	\N
75	1	175	occupied	2	88.93	4507	f	f	\N
76	1	176	occupied	2	71.97	5726	t	f	\N
77	1	177	occupied	5	16.81	2977	t	f	\N
78	1	178	occupied	2	15.29	2899	t	f	\N
79	1	179	occupied	3	10.79	7847	t	f	\N
80	1	180	occupied	5	72.28	9987	t	f	\N
81	1	181	occupied	3	45.98	9006	f	f	\N
82	1	182	occupied	5	5.00	9322	f	f	\N
83	1	183	occupied	1	97.02	3618	f	f	\N
84	1	184	occupied	3	81.86	5591	f	f	\N
85	1	185	occupied	5	13.31	1236	t	f	\N
86	1	186	occupied	5	6.64	4521	t	f	\N
87	1	187	occupied	5	47.49	7712	t	f	\N
88	1	188	occupied	2	25.96	7850	f	f	\N
89	1	189	occupied	1	32.72	3462	t	f	\N
90	1	190	vacant	4	36.44	8094	f	f	\N
91	1	191	occupied	5	92.27	6461	t	f	\N
92	1	192	occupied	3	44.62	5901	t	f	\N
93	1	193	under_maintenance	3	28.08	6958	t	f	\N
94	1	194	occupied	4	95.74	1697	t	f	\N
95	1	195	occupied	2	62.99	9544	t	f	\N
96	1	196	occupied	5	86.51	7879	t	f	\N
97	1	197	occupied	3	11.29	1857	t	f	\N
98	1	198	occupied	1	50.48	6250	t	f	\N
99	1	199	occupied	3	34.20	1400	f	f	\N
100	1	200	occupied	5	6.90	4631	f	f	\N
105	1	203	occupied	1	0.00	\N	f	f	4000
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: dormy; Owner: ionize13
--

COPY dormy.tenants (id, clerk_user_id, email, phone, move_in_date, lease_start, lease_end, monthly_rent, first_name, last_name, apartment_id, room_number) FROM stdin;
1	1	joneslauren@example.net	446-293-5644	2023-08-29	2023-09-03	2024-09-02	1653.12	Joseph	Escobar	1	101
2	1	craighughes@example.net	568-047-5984	2023-10-24	2023-10-29	2024-10-28	1962.36	Aaron	Townsend	1	102
3	1	ikim@example.com	394-849-9568	2024-12-19	2024-12-24	2025-12-24	1009.29	Lisa	Miller	1	103
4	1	edward06@example.org	266-877-5621	2023-08-26	2023-08-31	2024-08-30	1403.97	Nicolas	Juarez	1	104
5	1	sarah93@example.com	212-879-7470	2023-07-11	2023-07-16	2024-07-15	1707.08	Glenn	Sexton	1	105
6	1	fayala@example.net	777-328-0445	2025-01-17	2025-01-22	2026-01-22	1537.98	Chase	Murray	1	106
7	1	qrocha@example.net	624-359-7463	2024-01-25	2024-01-30	2025-01-29	1785.68	Steven	Garcia	1	107
8	1	kathy63@example.net	187-023-9705	2024-10-24	2024-10-29	2025-10-29	1718.23	Jessica	Duke	1	108
9	1	danielsanders@example.net	303-333-0787	2024-05-11	2024-05-16	2025-05-16	1859.32	Thomas	Ramirez	1	109
10	1	coledaniel@example.com	492-069-3068	2024-07-20	2024-07-25	2025-07-25	1958.10	Deanna	Mcdonald	1	110
11	1	destiny06@example.org	088-524-2344	2024-10-05	2024-10-10	2025-10-10	1006.53	Joseph	Harris	1	111
12	1	christopher43@example.net	482-534-4552	2025-01-16	2025-01-21	2026-01-21	1224.33	Laurie	Lopez	1	112
13	1	williamedwards@example.org	780-167-7053	2023-07-24	2023-07-29	2024-07-28	1727.55	Michael	Lowe	1	113
14	1	uwallace@example.net	708-732-1663	2023-09-24	2023-09-29	2024-09-28	924.55	Edward	Johnson	1	114
15	1	thomasellis@example.net	721-695-3764	2024-02-22	2024-02-27	2025-02-26	1883.47	Juan	Moyer	1	115
16	1	moniquejones@example.com	351-187-7886	2024-11-26	2024-12-01	2025-12-01	1767.17	Michelle	Estrada	1	116
17	1	belllaura@example.com	624-449-1074	2024-10-10	2024-10-15	2025-10-15	1626.62	Kyle	Sanders	1	117
18	1	leeanthony@example.net	826-123-2957	2024-04-12	2024-04-17	2025-04-17	1403.64	Nathan	Colon	1	118
19	1	dalebeard@example.com	333-811-5915	2024-02-04	2024-02-09	2025-02-08	862.68	Brian	Ramsey	1	119
20	1	youngjennifer@example.net	692-812-2765	2023-03-29	2023-04-03	2024-04-02	1699.82	Brian	Robinson	1	120
21	1	patrick91@example.org	594-385-5203	2023-10-11	2023-10-16	2024-10-15	1244.24	Angela	Ramsey	1	121
22	1	jesuswilliams@example.org	043-908-3305	2024-07-05	2024-07-10	2025-07-10	1019.27	Abigail	James	1	122
23	1	rhodescorey@example.org	915-103-3641	2023-07-29	2023-08-03	2024-08-02	1892.00	Michelle	Erickson	1	123
24	1	erinvillarreal@example.net	830-771-5282	2023-06-05	2023-06-10	2024-06-09	1227.53	Jennifer	Rocha	1	124
25	1	joshuaalvarez@example.com	122-612-5759	2024-12-06	2024-12-11	2025-12-11	1406.97	Joshua	Reid	1	125
26	1	alicia56@example.org	787-927-7668	2023-08-03	2023-08-08	2024-08-07	1019.48	Larry	Flores	1	126
27	1	charles86@example.com	037-933-0835	2023-07-18	2023-07-23	2024-07-22	1869.68	Susan	Rivera	1	127
28	1	barbaranunez@example.com	820-250-5547	2024-05-21	2024-05-26	2025-05-26	1409.59	Gail	Johnson	1	128
29	1	chooper@example.net	340-155-2494	2024-07-02	2024-07-07	2025-07-07	965.46	Eric	Green	1	129
30	1	jason10@example.net	963-146-9908	2024-12-07	2024-12-12	2025-12-12	1274.63	Theodore	Lee	1	130
31	1	gcarroll@example.com	436-760-5308	2024-10-04	2024-10-09	2025-10-09	977.36	Kimberly	Lopez	1	131
32	1	bwillis@example.net	610-749-2052	2024-01-10	2024-01-15	2025-01-14	1764.51	Heather	Reed	1	132
33	1	oevans@example.com	564-167-8668	2024-06-10	2024-06-15	2025-06-15	1728.58	Kristy	Spencer	1	133
34	1	iboyle@example.com	049-394-9419	2024-11-29	2024-12-04	2025-12-04	1941.10	Julie	Neal	1	134
35	1	lopezmichelle@example.com	284-245-0087	2024-06-04	2024-06-09	2025-06-09	1771.57	Michael	Mccormick	1	135
36	1	millerjustin@example.net	002-236-8420	2024-06-16	2024-06-21	2025-06-21	1416.93	Damon	Martinez	1	136
37	1	steven98@example.net	049-108-1532	2023-03-28	2023-04-02	2024-04-01	1536.92	Megan	Bauer	1	137
38	1	lauren02@example.net	162-114-4863	2023-06-17	2023-06-22	2024-06-21	1985.20	Jeanette	Lee	1	138
39	1	lwalsh@example.org	722-673-6619	2024-01-18	2024-01-23	2025-01-22	1834.87	Jenny	Ramirez	1	139
40	1	fwashington@example.com	868-757-7294	2023-10-22	2023-10-27	2024-10-26	1428.08	Donna	Turner	1	140
41	1	jstewart@example.net	891-076-6044	2025-01-04	2025-01-09	2026-01-09	1540.34	Kristy	Jensen	1	141
42	1	xsnyder@example.net	638-045-6554	2024-03-08	2024-03-13	2025-03-13	1898.15	Randy	Stewart	1	142
43	1	thomas90@example.com	926-700-2865	2023-07-06	2023-07-11	2024-07-10	1170.20	Michael	Drake	1	143
44	1	kimberly15@example.net	220-717-8697	2024-08-26	2024-08-31	2025-08-31	1641.09	Anthony	Bird	1	144
45	1	bonniewhite@example.net	110-097-5974	2023-06-07	2023-06-12	2024-06-11	1970.11	Daniel	Estrada	1	145
46	1	gwells@example.com	154-912-8533	2024-10-06	2024-10-11	2025-10-11	1664.25	Whitney	Perry	1	146
47	1	jessicafarmer@example.com	478-225-5240	2024-10-22	2024-10-27	2025-10-27	922.95	Jessica	Garrison	1	147
48	1	eric75@example.com	909-486-6525	2024-12-16	2024-12-21	2025-12-21	1083.40	Paul	Harris	1	148
49	1	stacy24@example.org	731-953-2338	2024-10-07	2024-10-12	2025-10-12	818.79	Tina	Hicks	1	149
50	1	juliemay@example.com	038-714-8687	2023-08-09	2023-08-14	2024-08-13	864.82	Donna	Johnson	1	150
51	1	jferguson@example.net	911-594-8920	2024-07-08	2024-07-13	2025-07-13	846.10	Sarah	Walker	1	151
52	1	nicholsoncorey@example.net	792-900-6252	2023-10-31	2023-11-05	2024-11-04	1917.72	Jeffrey	Rogers	1	152
53	1	nyates@example.net	739-371-1307	2024-10-16	2024-10-21	2025-10-21	1081.16	Justin	Short	1	153
54	1	johnsonmary@example.net	461-040-4847	2025-02-26	2025-03-03	2026-03-03	1857.58	Stephanie	Diaz	1	154
55	1	qjones@example.net	068-987-7995	2023-09-28	2023-10-03	2024-10-02	840.98	Ashley	Nguyen	1	155
56	1	ahenry@example.com	811-553-6829	2023-05-16	2023-05-21	2024-05-20	1188.40	Heather	Curtis	1	156
57	1	petersonpaula@example.com	197-931-9363	2024-10-27	2024-11-01	2025-11-01	846.05	Alexandra	Barron	1	157
58	1	dale73@example.net	668-263-3234	2024-04-01	2024-04-06	2025-04-06	1545.31	Kelsey	Woods	1	158
59	1	kenneth21@example.com	795-027-5287	2024-08-30	2024-09-04	2025-09-04	882.14	Laura	Mooney	1	159
60	1	pauljacqueline@example.com	093-431-7660	2024-10-16	2024-10-21	2025-10-21	1142.95	Caleb	Griffin	1	160
61	1	joseph84@example.org	441-405-4463	2024-07-29	2024-08-03	2025-08-03	1900.58	Jose	Johnson	1	161
62	1	heidiwinters@example.com	317-938-7055	2024-01-07	2024-01-12	2025-01-11	864.76	Hannah	Carroll	1	162
63	1	nicholasbaker@example.com	031-344-2492	2024-09-17	2024-09-22	2025-09-22	1876.43	Christopher	Smith	1	163
64	1	nicole63@example.net	532-778-9152	2024-06-11	2024-06-16	2025-06-16	1047.17	Joseph	Frank	1	164
65	1	anthonybuchanan@example.org	326-059-2385	2024-09-21	2024-09-26	2025-09-26	1391.77	Tyler	Mitchell	1	165
66	1	cholland@example.com	029-594-3787	2023-11-17	2023-11-22	2024-11-21	1264.65	Nicholas	Carrillo	1	166
67	1	melanie98@example.org	460-993-2630	2023-11-06	2023-11-11	2024-11-10	1490.62	Christine	James	1	167
68	1	robleshaley@example.net	240-391-5942	2025-01-09	2025-01-14	2026-01-14	1104.35	Susan	Jackson	1	168
69	1	karipreston@example.com	185-755-6257	2024-04-12	2024-04-17	2025-04-17	1571.41	Kyle	Jones	1	169
70	1	michellelong@example.net	806-393-2970	2023-11-01	2023-11-06	2024-11-05	1399.19	Michael	Kim	1	170
71	1	powellthomas@example.net	467-827-1914	2024-09-28	2024-10-03	2025-10-03	1830.03	Peggy	Calderon	1	171
72	1	brittanyjacobson@example.com	560-376-3481	2024-10-17	2024-10-22	2025-10-22	1264.87	Ana	Mcguire	1	172
73	1	marksmonica@example.com	974-319-0145	2023-07-06	2023-07-11	2024-07-10	1908.39	Thomas	Wyatt	1	173
74	1	williamslisa@example.com	629-451-0744	2023-03-20	2023-03-25	2024-03-24	820.71	Marc	Cooper	1	174
75	1	brendamalone@example.net	059-493-5724	2024-10-10	2024-10-15	2025-10-15	969.45	Ryan	Jones	1	175
76	1	curtis47@example.com	015-235-8452	2024-01-10	2024-01-15	2025-01-14	1141.94	Megan	Jones	1	176
77	1	tara16@example.com	922-318-4946	2025-02-23	2025-02-28	2026-02-28	1981.48	Mary	Owens	1	177
78	1	carlsullivan@example.org	920-126-9312	2025-02-03	2025-02-08	2026-02-08	1518.29	Michael	Steele	1	178
79	1	silvamaria@example.org	952-547-8743	2024-04-25	2024-04-30	2025-04-30	1607.15	Paul	Wilson	1	179
80	1	jamesmiller@example.com	105-685-9028	2023-09-11	2023-09-16	2024-09-15	1359.12	Carrie	Acosta	1	180
81	1	vanderson@example.com	895-838-9964	2023-11-04	2023-11-09	2024-11-08	1569.21	Daniel	Campbell	1	181
82	1	mary62@example.com	833-068-9659	2025-02-04	2025-02-09	2026-02-09	1790.50	Theodore	Nichols	1	182
83	1	alexanderamy@example.com	722-840-6182	2023-09-13	2023-09-18	2024-09-17	1633.17	William	Lewis	1	183
84	1	bcarpenter@example.org	732-178-1140	2024-07-14	2024-07-19	2025-07-19	1547.51	Cassandra	Reynolds	1	184
85	1	lowejonathan@example.net	343-852-7500	2024-09-07	2024-09-12	2025-09-12	1939.38	David	Caldwell	1	185
86	1	icooper@example.net	011-226-0114	2025-01-24	2025-01-29	2026-01-29	1652.26	Gloria	Rodriguez	1	186
87	1	shawn42@example.org	960-257-9108	2023-05-23	2023-05-28	2024-05-27	1428.63	Cynthia	Bird	1	187
88	1	laurenevans@example.com	318-677-1273	2023-06-02	2023-06-07	2024-06-06	1529.61	Jose	Young	1	188
89	1	rosarioandrew@example.net	932-497-6510	2023-04-19	2023-04-24	2024-04-23	880.99	Patricia	Walker	1	189
90	1	perezcatherine@example.org	619-956-7319	2024-09-12	2024-09-17	2025-09-17	1682.31	Christian	Dean	1	190
91	1	garciabrandon@example.net	562-461-0758	2024-06-20	2024-06-25	2025-06-25	1631.57	Tracie	Smith	1	191
92	1	ldavila@example.org	106-963-7095	2023-06-01	2023-06-06	2024-06-05	1733.62	Todd	Rogers	1	192
93	1	robersonjuan@example.net	044-691-3413	2024-07-28	2024-08-02	2025-08-02	856.75	Jeffrey	Fleming	1	193
94	1	robertlevy@example.net	376-058-4602	2023-04-21	2023-04-26	2024-04-25	1558.13	Jeffrey	Armstrong	1	194
95	1	nashsteven@example.org	920-852-8317	2023-04-04	2023-04-09	2024-04-08	1982.50	Robert	Vincent	1	195
96	1	mckinneymichael@example.org	672-928-0354	2023-12-09	2023-12-14	2024-12-13	1200.85	Kristine	Brown	1	196
97	1	teresachen@example.com	669-661-3526	2024-02-27	2024-03-03	2025-03-03	1962.33	Steven	Lee	1	197
98	1	loganfletcher@example.org	801-119-9768	2023-06-04	2023-06-09	2024-06-08	1091.00	Andrea	Thomas	1	198
99	1	wanda35@example.com	311-591-3438	2024-07-26	2024-07-31	2025-07-31	1255.55	Victoria	Burton	1	199
100	1	ramirezhayley@example.net	465-011-1074	2024-10-07	2024-10-12	2025-10-12	1368.78	Philip	Goodwin	1	200
104	1	iomize.thaopech@gmail.com	\N	\N	\N	\N	\N	Insee	Thaopech	1	201
118	user_2twN47dDEZ9YWlCezwKV5jfAjx0	insee.t@kkumail.com	\N	\N	\N	\N	\N	insee	thaopech	1	203
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: dormy; Owner: ionize13
--

COPY dormy.users (user_id, full_name, email, phone, password_hash, created_at, clerk_id) FROM stdin;
1	ก้องภพ วัฒนชัย	kongpop@example.com	0812345678	hashedpassword1	2025-02-21 11:18:49+07	clerk_1
2	ณัฐวุฒิ อินทราวงศ์	nattawut@example.com	0898765432	hashedpassword2	2025-02-21 11:18:49+07	clerk_2
3	สุพิชฌาย์ อัครวุฒิ	supitcha@example.com	0851234567	hashedpassword3	2025-02-21 11:18:49+07	clerk_3
4	วรปรัชญ์ ศิริกุล	woraprat@example.com	0823456789	hashedpassword4	2025-02-21 11:18:49+07	clerk_4
5	พิมพ์ชนก จันทร์โอชา	pimchanok@example.com	0845671234	hashedpassword5	2025-02-21 11:18:49+07	clerk_5
6	อนุวัฒน์ นาคพงศ์	anuwat@example.com	0867894561	hashedpassword6	2025-02-21 11:18:49+07	clerk_6
7	ธันวา ศรีวรากร	tanwa@example.com	0832587412	hashedpassword7	2025-02-21 11:18:49+07	clerk_7
8	สิรินาถ โชติวงศ์	sirinart@example.com	0896541237	hashedpassword8	2025-02-21 11:18:49+07	clerk_8
9	ปวีณา บุญประเสริฐ	paveena@example.com	0874123659	hashedpassword9	2025-02-21 11:18:49+07	clerk_9
10	จิรพัฒน์ ศรีสวัสดิ์	jirapat@example.com	0889632541	hashedpassword10	2025-02-21 11:18:49+07	clerk_10
\.


--
-- Data for Name: utility_bills; Type: TABLE DATA; Schema: dormy; Owner: ionize13
--

COPY dormy.utility_bills (utility_id, tenant_id, service_type, amount, due_date, consumption_units, current_meter_reading, previous_meter_reading, meter_reading_date, is_paid, apartment_id) FROM stdin;
21	51	water	1835.20	2025-03-01	451	2342.95	1891.41	2025-02-20	t	1
22	60	water	1187.95	2025-03-08	416	3167.27	2750.68	2025-02-26	t	1
23	40	water	838.05	2025-03-22	457	4383.07	3925.87	2025-03-18	f	1
24	85	water	1990.82	2025-03-02	354	4308.64	3954.17	2025-02-21	f	1
25	96	water	263.76	2025-03-26	360	3547.69	3187.02	2025-03-22	t	1
26	43	water	389.26	2025-03-23	461	2404.03	1942.59	2025-03-21	f	1
27	31	water	571.50	2025-03-02	348	4378.99	4030.84	2025-03-01	t	1
28	15	electricity	212.84	2025-03-12	70	1952.05	1881.15	2025-03-02	t	1
29	95	water	1518.44	2025-03-03	122	1519.01	1396.60	2025-02-26	t	1
30	40	electricity	1337.42	2025-03-14	250	2071.98	1821.10	2025-03-11	f	1
31	10	electricity	1488.33	2025-03-07	271	3526.19	3254.37	2025-03-06	f	1
32	68	water	820.71	2025-03-28	268	1502.93	1234.77	2025-03-27	t	1
33	23	electricity	177.69	2025-03-21	64	1403.61	1339.05	2025-03-16	t	1
34	86	water	421.48	2025-03-18	410	1791.49	1380.98	2025-03-11	t	1
35	90	water	597.68	2025-03-12	275	3969.80	3694.77	2025-03-11	t	1
36	58	electricity	1555.83	2025-03-10	232	1567.85	1335.74	2025-03-03	t	1
37	17	electricity	1749.89	2025-03-29	450	1016.01	565.63	2025-03-24	t	1
38	89	water	1556.48	2025-03-02	84	3216.12	3132.10	2025-03-01	f	1
39	21	water	895.70	2025-03-11	357	1765.22	1407.67	2025-03-06	f	1
40	81	electricity	1923.46	2025-03-11	405	3652.65	3246.66	2025-03-07	t	1
41	78	electricity	876.84	2025-03-11	310	2041.20	1730.65	2025-03-04	f	1
42	74	electricity	894.48	2025-03-03	213	3484.09	3271.02	2025-02-22	f	1
43	38	electricity	1643.48	2025-03-24	361	1146.16	784.85	2025-03-21	f	1
44	78	electricity	770.97	2025-03-24	64	3381.76	3316.82	2025-03-20	t	1
45	55	electricity	591.67	2025-03-17	116	4106.43	3990.22	2025-03-13	t	1
46	58	electricity	1845.10	2025-03-21	293	4219.13	3925.68	2025-03-17	f	1
47	47	water	1997.95	2025-03-29	468	1426.71	958.17	2025-03-24	f	1
48	46	water	1528.76	2025-03-28	158	2090.91	1932.46	2025-03-24	t	1
49	40	water	1288.39	2025-03-15	137	2062.66	1925.36	2025-03-12	f	1
50	99	electricity	276.45	2025-03-01	273	3872.39	3599.27	2025-02-24	t	1
51	75	water	1032.64	2025-03-29	223	1847.31	1623.83	2025-03-25	t	1
52	36	electricity	1816.38	2025-03-23	408	2291.63	1883.34	2025-03-21	t	1
53	88	water	265.30	2025-03-14	106	4625.89	4519.11	2025-03-10	f	1
54	77	water	1470.53	2025-03-03	192	3664.95	3472.00	2025-02-23	f	1
55	36	electricity	1212.69	2025-03-20	270	3292.67	3022.42	2025-03-18	f	1
56	46	water	264.50	2025-03-24	151	2316.04	2164.58	2025-03-22	f	1
57	96	water	254.20	2025-03-11	241	4316.97	4075.07	2025-03-07	t	1
58	67	water	1031.25	2025-03-14	331	3480.23	3149.03	2025-03-10	f	1
59	98	electricity	1515.40	2025-03-07	162	3136.30	2973.42	2025-02-25	f	1
60	68	water	338.48	2025-03-11	405	1270.63	864.73	2025-03-09	t	1
61	44	water	1526.53	2025-03-13	183	3929.14	3745.86	2025-03-12	t	1
62	46	water	1600.86	2025-03-17	452	1503.86	1050.97	2025-03-15	f	1
63	43	electricity	1009.51	2025-03-29	105	3067.86	2962.43	2025-03-26	t	1
64	76	electricity	569.42	2025-03-04	495	2311.86	1816.19	2025-03-01	t	1
65	40	water	311.93	2025-02-28	295	4665.71	4370.41	2025-02-23	f	1
66	18	electricity	1480.44	2025-03-09	236	3444.73	3208.54	2025-03-03	t	1
67	98	water	1302.60	2025-03-04	464	2938.59	2474.13	2025-02-22	t	1
68	46	water	1693.05	2025-03-06	424	1011.51	587.36	2025-03-01	t	1
69	16	water	950.82	2025-03-04	353	1570.84	1217.18	2025-02-24	t	1
70	63	water	1455.41	2025-03-02	371	1377.48	1005.86	2025-02-24	f	1
71	23	electricity	1527.89	2025-03-29	157	2628.08	2470.43	2025-03-27	f	1
72	71	water	901.04	2025-03-09	121	1784.61	1663.43	2025-02-28	t	1
73	74	water	1588.89	2025-03-03	121	4539.59	4417.98	2025-02-23	f	1
74	62	water	293.99	2025-03-25	169	3151.59	2982.43	2025-03-24	f	1
75	12	water	538.83	2025-03-27	189	4239.92	4050.58	2025-03-21	f	1
76	58	electricity	1960.66	2025-03-04	63	4747.46	4684.18	2025-03-02	t	1
77	77	water	345.18	2025-03-24	51	3553.81	3502.65	2025-03-23	t	1
78	48	electricity	899.48	2025-03-06	356	4218.40	3861.59	2025-03-05	t	1
79	87	water	1787.47	2025-03-23	383	1199.49	815.70	2025-03-22	f	1
80	38	water	924.46	2025-03-05	310	2723.69	2412.93	2025-03-04	f	1
81	49	water	1075.85	2025-03-16	73	1071.36	997.54	2025-03-15	t	1
82	97	water	1311.63	2025-03-07	444	1079.51	635.00	2025-03-01	f	1
83	14	water	1329.08	2025-03-18	416	2861.93	2445.48	2025-03-12	f	1
84	27	water	922.36	2025-03-09	247	4341.95	4094.23	2025-03-01	f	1
85	36	electricity	1348.72	2025-03-25	93	1158.32	1065.17	2025-03-19	t	1
86	65	electricity	598.75	2025-03-04	190	2492.69	2302.03	2025-02-23	t	1
87	65	water	1227.81	2025-03-09	218	3940.72	3722.63	2025-02-27	f	1
88	78	water	518.08	2025-03-29	174	1468.30	1293.46	2025-03-24	f	1
89	42	electricity	1461.62	2025-03-02	330	2028.28	1697.94	2025-03-01	t	1
90	40	electricity	470.57	2025-03-15	249	2420.85	2171.28	2025-03-12	t	1
91	19	water	204.83	2025-03-07	269	3453.55	3184.35	2025-02-26	f	1
92	21	electricity	191.47	2025-03-28	362	2191.56	1829.01	2025-03-19	t	1
93	39	electricity	140.56	2025-03-14	475	4451.81	3975.83	2025-03-05	t	1
94	24	water	1931.61	2025-03-27	297	3687.66	3389.97	2025-03-20	f	1
95	48	electricity	1444.97	2025-03-21	499	4750.00	4250.50	2025-03-14	t	1
96	99	electricity	1240.35	2025-03-12	241	2221.36	1980.36	2025-03-07	t	1
97	19	water	1626.76	2025-03-04	367	3504.27	3136.69	2025-02-28	f	1
98	88	water	1233.53	2025-03-14	228	4186.08	3957.99	2025-03-07	f	1
99	61	electricity	266.43	2025-03-03	306	4956.77	4650.18	2025-02-21	f	1
100	10	water	1850.43	2025-03-17	363	4466.89	4103.55	2025-03-10	f	1
101	49	water	383.22	2025-03-16	121	1665.50	1543.62	2025-03-12	t	1
102	36	water	1915.56	2025-03-06	310	2800.94	2490.31	2025-02-28	t	1
103	11	electricity	1050.72	2025-03-12	230	2407.17	2176.56	2025-03-05	t	1
104	52	electricity	1977.76	2025-03-05	50	2523.00	2472.07	2025-02-27	t	1
105	56	electricity	253.43	2025-03-17	266	3253.98	2987.07	2025-03-15	t	1
106	73	electricity	1828.75	2025-03-20	430	1781.94	1351.05	2025-03-16	t	1
107	93	electricity	1081.27	2025-03-25	274	4289.90	4015.03	2025-03-15	f	1
108	33	electricity	1470.57	2025-03-21	288	1974.52	1685.98	2025-03-20	f	1
109	40	water	1107.93	2025-03-18	190	4428.28	4237.97	2025-03-12	t	1
110	29	water	691.27	2025-03-17	76	1104.34	1027.75	2025-03-14	f	1
111	73	water	786.70	2025-03-11	290	1824.77	1534.15	2025-03-01	f	1
112	64	water	281.52	2025-03-03	478	3123.68	2645.19	2025-02-26	t	1
113	28	electricity	110.54	2025-03-17	113	1378.72	1264.79	2025-03-07	f	1
114	58	electricity	1200.53	2025-03-06	225	3758.58	3533.34	2025-03-01	t	1
115	82	water	1245.05	2025-03-06	267	4030.00	3762.36	2025-03-01	t	1
116	79	electricity	865.74	2025-03-11	218	1379.96	1161.67	2025-03-10	f	1
117	91	electricity	1819.87	2025-03-13	70	3184.80	3114.17	2025-03-07	t	1
118	86	electricity	909.77	2025-03-13	105	2432.24	2326.37	2025-03-09	f	1
119	20	water	1035.80	2025-03-06	231	4507.43	4276.32	2025-03-02	t	1
120	50	water	1433.16	2025-03-28	253	3842.31	3589.26	2025-03-21	f	1
\.


--
-- Name: apartments_apartment_id_seq; Type: SEQUENCE SET; Schema: dormy; Owner: postgres
--

SELECT pg_catalog.setval('dormy.apartments_apartment_id_seq', 12, true);


--
-- Name: owners_id_seq; Type: SEQUENCE SET; Schema: dormy; Owner: ionize13
--

SELECT pg_catalog.setval('dormy.owners_id_seq', 8, true);


--
-- Name: packages_id_seq; Type: SEQUENCE SET; Schema: dormy; Owner: ionize13
--

SELECT pg_catalog.setval('dormy.packages_id_seq', 14, true);


--
-- Name: promptpays_promptpay_id_seq; Type: SEQUENCE SET; Schema: dormy; Owner: ionize13
--

SELECT pg_catalog.setval('dormy.promptpays_promptpay_id_seq', 1, true);


--
-- Name: properties_id_seq; Type: SEQUENCE SET; Schema: dormy; Owner: ionize13
--

SELECT pg_catalog.setval('dormy.properties_id_seq', 10, true);


--
-- Name: rentbills_id_seq; Type: SEQUENCE SET; Schema: dormy; Owner: ionize13
--

SELECT pg_catalog.setval('dormy.rentbills_id_seq', 26, true);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: dormy; Owner: ionize13
--

SELECT pg_catalog.setval('dormy.reports_id_seq', 22, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: dormy; Owner: ionize13
--

SELECT pg_catalog.setval('dormy.rooms_id_seq', 105, true);


--
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: dormy; Owner: ionize13
--

SELECT pg_catalog.setval('dormy.tenants_id_seq', 118, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: dormy; Owner: ionize13
--

SELECT pg_catalog.setval('dormy.users_user_id_seq', 10, true);


--
-- Name: utility_bills_utility_id_seq; Type: SEQUENCE SET; Schema: dormy; Owner: ionize13
--

SELECT pg_catalog.setval('dormy.utility_bills_utility_id_seq', 120, true);


--
-- Name: apartments idx_16432_primary; Type: CONSTRAINT; Schema: dormy; Owner: postgres
--

ALTER TABLE ONLY dormy.apartments
    ADD CONSTRAINT idx_16432_primary PRIMARY KEY (apartment_id);


--
-- Name: bankaccounts idx_16442_primary; Type: CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.bankaccounts
    ADD CONSTRAINT idx_16442_primary PRIMARY KEY (bank_id);


--
-- Name: owners idx_16446_primary; Type: CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.owners
    ADD CONSTRAINT idx_16446_primary PRIMARY KEY (id);


--
-- Name: packages idx_16455_primary; Type: CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.packages
    ADD CONSTRAINT idx_16455_primary PRIMARY KEY (id);


--
-- Name: promptpays idx_16462_primary; Type: CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.promptpays
    ADD CONSTRAINT idx_16462_primary PRIMARY KEY (promptpay_id);


--
-- Name: properties idx_16469_primary; Type: CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.properties
    ADD CONSTRAINT idx_16469_primary PRIMARY KEY (id);


--
-- Name: rentbills idx_16475_primary; Type: CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.rentbills
    ADD CONSTRAINT idx_16475_primary PRIMARY KEY (id);


--
-- Name: reports idx_16481_primary; Type: CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.reports
    ADD CONSTRAINT idx_16481_primary PRIMARY KEY (id);


--
-- Name: rooms idx_16490_primary; Type: CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.rooms
    ADD CONSTRAINT idx_16490_primary PRIMARY KEY (id);


--
-- Name: tenants idx_16500_primary; Type: CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.tenants
    ADD CONSTRAINT idx_16500_primary PRIMARY KEY (id);


--
-- Name: users idx_16508_primary; Type: CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.users
    ADD CONSTRAINT idx_16508_primary PRIMARY KEY (user_id);


--
-- Name: utility_bills idx_16515_primary; Type: CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.utility_bills
    ADD CONSTRAINT idx_16515_primary PRIMARY KEY (utility_id);


--
-- Name: idx_16442_owner_id; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE INDEX idx_16442_owner_id ON dormy.bankaccounts USING btree (owner_id);


--
-- Name: idx_16446_default_apartment_id; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE INDEX idx_16446_default_apartment_id ON dormy.owners USING btree (default_apartment_id);


--
-- Name: idx_16446_email; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE UNIQUE INDEX idx_16446_email ON dormy.owners USING btree (email);


--
-- Name: idx_16462_promptpays_ibfk_1; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE INDEX idx_16462_promptpays_ibfk_1 ON dormy.promptpays USING btree (owner_id);


--
-- Name: idx_16475_tenant_id; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE INDEX idx_16475_tenant_id ON dormy.rentbills USING btree (tenant_id);


--
-- Name: idx_16490_rooms_ibfk_1; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE INDEX idx_16490_rooms_ibfk_1 ON dormy.rooms USING btree (apartment_id);


--
-- Name: idx_16500_email; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE UNIQUE INDEX idx_16500_email ON dormy.tenants USING btree (email);


--
-- Name: idx_16500_fk_tenant_apartment; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE INDEX idx_16500_fk_tenant_apartment ON dormy.tenants USING btree (apartment_id);


--
-- Name: idx_16508_clerk_id; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE UNIQUE INDEX idx_16508_clerk_id ON dormy.users USING btree (clerk_id);


--
-- Name: idx_16508_clerk_id_2; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE UNIQUE INDEX idx_16508_clerk_id_2 ON dormy.users USING btree (clerk_id);


--
-- Name: idx_16508_email; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE UNIQUE INDEX idx_16508_email ON dormy.users USING btree (email);


--
-- Name: idx_16515_tenant_id; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE INDEX idx_16515_tenant_id ON dormy.utility_bills USING btree (tenant_id);


--
-- Name: idx_16515_utility_bills_ibfk_2; Type: INDEX; Schema: dormy; Owner: ionize13
--

CREATE INDEX idx_16515_utility_bills_ibfk_2 ON dormy.utility_bills USING btree (apartment_id);


--
-- Name: properties on_update_current_timestamp; Type: TRIGGER; Schema: dormy; Owner: ionize13
--

CREATE TRIGGER on_update_current_timestamp BEFORE UPDATE ON dormy.properties FOR EACH ROW EXECUTE FUNCTION dormy.on_update_current_timestamp_properties();


--
-- Name: apartments apartments_owner_id_fkey; Type: FK CONSTRAINT; Schema: dormy; Owner: postgres
--

ALTER TABLE ONLY dormy.apartments
    ADD CONSTRAINT apartments_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES dormy.owners(id);


--
-- Name: bankaccounts bankaccounts_ibfk_1; Type: FK CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.bankaccounts
    ADD CONSTRAINT bankaccounts_ibfk_1 FOREIGN KEY (owner_id) REFERENCES dormy.owners(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: tenants fk_tenant_apartment; Type: FK CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.tenants
    ADD CONSTRAINT fk_tenant_apartment FOREIGN KEY (apartment_id) REFERENCES dormy.apartments(apartment_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: owners owners_ibfk_1; Type: FK CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.owners
    ADD CONSTRAINT owners_ibfk_1 FOREIGN KEY (default_apartment_id) REFERENCES dormy.apartments(apartment_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: rooms rooms_ibfk_1; Type: FK CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.rooms
    ADD CONSTRAINT rooms_ibfk_1 FOREIGN KEY (apartment_id) REFERENCES dormy.apartments(apartment_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: utility_bills utility_bills_ibfk_1; Type: FK CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.utility_bills
    ADD CONSTRAINT utility_bills_ibfk_1 FOREIGN KEY (tenant_id) REFERENCES dormy.tenants(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: utility_bills utility_bills_ibfk_2; Type: FK CONSTRAINT; Schema: dormy; Owner: ionize13
--

ALTER TABLE ONLY dormy.utility_bills
    ADD CONSTRAINT utility_bills_ibfk_2 FOREIGN KEY (apartment_id) REFERENCES dormy.apartments(apartment_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

--
-- Database "drizzle-60" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle-60; Type: DATABASE; Schema: -; Owner: ionize13
--

CREATE DATABASE "drizzle-60" WITH TEMPLATE = template0 ENCODING = 'SQL_ASCII' LOCALE_PROVIDER = libc LOCALE = 'C';


ALTER DATABASE "drizzle-60" OWNER TO ionize13;

\encoding SQL_ASCII
\connect -reuse-previous=on "dbname='drizzle-60'"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: ionize13
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO ionize13;

--
-- Name: userRole; Type: TYPE; Schema: public; Owner: ionize13
--

CREATE TYPE public."userRole" AS ENUM (
    'ADMIN',
    'BASIC'
);


ALTER TYPE public."userRole" OWNER TO ionize13;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: ionize13
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO ionize13;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: ionize13
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO ionize13;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: ionize13
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: category; Type: TABLE; Schema: public; Owner: ionize13
--

CREATE TABLE public.category (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.category OWNER TO ionize13;

--
-- Name: post; Type: TABLE; Schema: public; Owner: ionize13
--

CREATE TABLE public.post (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    "averageRating" real DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAd" timestamp without time zone DEFAULT now() NOT NULL,
    "authorId" uuid NOT NULL
);


ALTER TABLE public.post OWNER TO ionize13;

--
-- Name: postCategory; Type: TABLE; Schema: public; Owner: ionize13
--

CREATE TABLE public."postCategory" (
    "postId" uuid NOT NULL,
    "categoryId" uuid NOT NULL
);


ALTER TABLE public."postCategory" OWNER TO ionize13;

--
-- Name: user; Type: TABLE; Schema: public; Owner: ionize13
--

CREATE TABLE public."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    age integer NOT NULL,
    email character varying(255) NOT NULL,
    "userRole" public."userRole" DEFAULT 'BASIC'::public."userRole" NOT NULL
);


ALTER TABLE public."user" OWNER TO ionize13;

--
-- Name: userPreferences; Type: TABLE; Schema: public; Owner: ionize13
--

CREATE TABLE public."userPreferences" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "emailUpdates" boolean DEFAULT false NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public."userPreferences" OWNER TO ionize13;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: ionize13
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: ionize13
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	1612f2487ac0403df7fe5cd8be29abc5aa180c64f355715238e903fe832eff5f	1749214294768
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: ionize13
--

COPY public.category (id, name) FROM stdin;
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: ionize13
--

COPY public.post (id, title, "averageRating", "createdAt", "updatedAd", "authorId") FROM stdin;
\.


--
-- Data for Name: postCategory; Type: TABLE DATA; Schema: public; Owner: ionize13
--

COPY public."postCategory" ("postId", "categoryId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: ionize13
--

COPY public."user" (id, name, age, email, "userRole") FROM stdin;
6fb86d8c-b7a5-4fc8-ba94-c3b9409baf7a	Updated Name	29	test@test2.com	BASIC
77248824-a6bb-464f-88fa-319c256828eb	Updated Name	30	test@test.com	BASIC
\.


--
-- Data for Name: userPreferences; Type: TABLE DATA; Schema: public; Owner: ionize13
--

COPY public."userPreferences" (id, "emailUpdates", "userId") FROM stdin;
18d82995-bcb5-4c4a-bdea-b501f55af3d8	t	77248824-a6bb-464f-88fa-319c256828eb
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: ionize13
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: ionize13
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: ionize13
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: postCategory postCategory_postId_categoryId_pk; Type: CONSTRAINT; Schema: public; Owner: ionize13
--

ALTER TABLE ONLY public."postCategory"
    ADD CONSTRAINT "postCategory_postId_categoryId_pk" PRIMARY KEY ("postId", "categoryId");


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: ionize13
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: user uniqueNameAndAge; Type: CONSTRAINT; Schema: public; Owner: ionize13
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "uniqueNameAndAge" UNIQUE (name, age);


--
-- Name: userPreferences userPreferences_pkey; Type: CONSTRAINT; Schema: public; Owner: ionize13
--

ALTER TABLE ONLY public."userPreferences"
    ADD CONSTRAINT "userPreferences_pkey" PRIMARY KEY (id);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: ionize13
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: ionize13
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: emailIndex; Type: INDEX; Schema: public; Owner: ionize13
--

CREATE UNIQUE INDEX "emailIndex" ON public."user" USING btree (email);


--
-- Name: postCategory postCategory_categoryId_category_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ionize13
--

ALTER TABLE ONLY public."postCategory"
    ADD CONSTRAINT "postCategory_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES public.category(id);


--
-- Name: postCategory postCategory_postId_post_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ionize13
--

ALTER TABLE ONLY public."postCategory"
    ADD CONSTRAINT "postCategory_postId_post_id_fk" FOREIGN KEY ("postId") REFERENCES public.post(id);


--
-- Name: post post_authorId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ionize13
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "post_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES public."user"(id);


--
-- Name: userPreferences userPreferences_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ionize13
--

ALTER TABLE ONLY public."userPreferences"
    ADD CONSTRAINT "userPreferences_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

