-- Susaru Agro Database Backup
-- This file contains all the necessary SQL to recreate the database structure
-- Last updated: May 20, 2025

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS plant_shipment CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS proposal CASCADE;
DROP TABLE IF EXISTS inventory_plant CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS request CASCADE;
DROP TABLE IF EXISTS message CASCADE;
DROP TABLE IF EXISTS visitor_land CASCADE;
DROP TABLE IF EXISTS customer_land CASCADE;
DROP TABLE IF EXISTS visitor CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS role CASCADE;

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS customer_id_seq;
DROP SEQUENCE IF EXISTS visitor_id_seq;
DROP SEQUENCE IF EXISTS customer_land_id_seq;
DROP SEQUENCE IF EXISTS visitor_land_id_seq;
DROP SEQUENCE IF EXISTS inventory_id_seq;
DROP SEQUENCE IF EXISTS payment_id_seq;

-- Create sequences for custom ID formats
CREATE SEQUENCE customer_id_seq START 1;
CREATE SEQUENCE visitor_id_seq START 1;
CREATE SEQUENCE customer_land_id_seq START 1;
CREATE SEQUENCE visitor_land_id_seq START 1;
CREATE SEQUENCE inventory_id_seq START 1;
CREATE SEQUENCE payment_id_seq START 1;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    customer_id integer NOT NULL,
    title character varying(5),
    name_with_ini character varying(100) NOT NULL,
    full_name character varying(255) NOT NULL,
    f_name character varying(50) NOT NULL,
    l_name character varying(50) NOT NULL,
    date_of_birth date,
    nic_number character varying(12),
    add_line_1 text,
    add_line_2 text,
    add_line_3 text,
    city character varying(50),
    district character varying(50),
    province character varying(50),
    phone_no_1 character varying(12),
    phone_no_2 character varying(12),
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: customer_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_customer_id_seq OWNER TO postgres;

--
-- Name: customer_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_customer_id_seq OWNED BY public.customer.customer_id;


--
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_id_seq OWNER TO postgres;

--
-- Name: customer_land; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_land (
    customer_land_id integer NOT NULL,
    customer_id integer NOT NULL,
    province character varying(50),
    district character varying(50),
    city character varying(50),
    climate_zone character varying(50),
    land_shape character varying(50),
    has_water boolean,
    soil_type character varying(50),
    has_stones boolean,
    has_landslide_risk boolean,
    has_forestry boolean,
    land_size numeric(10,2)
);


ALTER TABLE public.customer_land OWNER TO postgres;

--
-- Name: customer_land_customer_land_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_land_customer_land_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_land_customer_land_id_seq OWNER TO postgres;

--
-- Name: customer_land_customer_land_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_land_customer_land_id_seq OWNED BY public.customer_land.customer_land_id;


--
-- Name: customer_land_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_land_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_land_id_seq OWNER TO postgres;

--
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    inventory_id integer NOT NULL,
    staff_id integer,
    item_name character varying(255) NOT NULL,
    item_type character varying(15),
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    CONSTRAINT inventory_item_type_check CHECK (((item_type)::text = ANY ((ARRAY['Plant'::character varying, 'Fertilizer'::character varying])::text[])))
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_id_seq OWNER TO postgres;

--
-- Name: inventory_inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_inventory_id_seq OWNER TO postgres;

--
-- Name: inventory_inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_inventory_id_seq OWNED BY public.inventory.inventory_id;


--
-- Name: message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message (
    message_id integer NOT NULL,
    f_name character varying(50) NOT NULL,
    l_name character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    phone_no character varying(12),
    interested_in character varying(50),
    message_text text NOT NULL,
    status character varying(20) DEFAULT 'new'::character varying,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.message OWNER TO postgres;

--
-- Name: message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.message_id_seq OWNER TO postgres;

--
-- Name: message_message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.message_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.message_message_id_seq OWNER TO postgres;

--
-- Name: message_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.message_message_id_seq OWNED BY public.message.message_id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    notification_id integer NOT NULL,
    customer_id integer,
    staff_id integer,
    message text NOT NULL,
    sent_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_id_seq OWNER TO postgres;

--
-- Name: notification_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_notification_id_seq OWNER TO postgres;

--
-- Name: notification_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_notification_id_seq OWNED BY public.notification.notification_id;


--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    payment_id integer NOT NULL,
    proposal_id integer NOT NULL,
    payment_date date NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_detail text NOT NULL,
    payment_receipt_url character varying(255)
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_id_seq OWNER TO postgres;

--
-- Name: payment_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_payment_id_seq OWNER TO postgres;

--
-- Name: payment_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_payment_id_seq OWNED BY public.payment.payment_id;


--
-- Name: progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.progress (
    progress_id integer NOT NULL,
    project_id integer NOT NULL,
    phase character varying(20) NOT NULL,
    date date NOT NULL,
    topic character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.progress OWNER TO postgres;

--
-- Name: progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.progress_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.progress_id_seq OWNER TO postgres;

--
-- Name: progress_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.progress_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.progress_progress_id_seq OWNER TO postgres;

--
-- Name: progress_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.progress_progress_id_seq OWNED BY public.progress.progress_id;


--
-- Name: project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project (
    project_id integer NOT NULL,
    staff_id integer,
    project_type character varying(10) DEFAULT 'Agarwood'::character varying,
    status character varying(10) DEFAULT 'Pending'::character varying,
    start_date date,
    end_date date,
    proposal_id integer,
    CONSTRAINT project_project_type_check CHECK (((project_type)::text = ANY ((ARRAY['Agarwood'::character varying, 'Sandalwood'::character varying, 'Vanilla'::character varying, 'Other'::character varying])::text[]))),
    CONSTRAINT project_status_check CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Ongoing'::character varying, 'Completed'::character varying])::text[])))
);


ALTER TABLE public.project OWNER TO postgres;

--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_id_seq OWNER TO postgres;

--
-- Name: project_project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_project_id_seq OWNER TO postgres;

--
-- Name: project_project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_project_id_seq OWNED BY public.project.project_id;


--
-- Name: proposal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proposal (
    proposal_id integer NOT NULL,
    customer_id integer NOT NULL,
    payment_mode character varying(12),
    installment_count integer,
    installment_amount numeric(10,2) DEFAULT NULL::numeric,
    proposal_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT proposal_payment_mode_check CHECK (((payment_mode)::text = ANY ((ARRAY['full'::character varying, 'installment'::character varying])::text[])))
);


ALTER TABLE public.proposal OWNER TO postgres;

--
-- Name: proposal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proposal_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proposal_id_seq OWNER TO postgres;

--
-- Name: proposal_proposal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proposal_proposal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proposal_proposal_id_seq OWNER TO postgres;

--
-- Name: proposal_proposal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proposal_proposal_id_seq OWNED BY public.proposal.proposal_id;


--
-- Name: request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request (
    request_id integer NOT NULL,
    customer_id integer NOT NULL,
    request_details text NOT NULL,
    request_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.request OWNER TO postgres;

--
-- Name: request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.request_id_seq OWNER TO postgres;

--
-- Name: request_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.request_request_id_seq OWNER TO postgres;

--
-- Name: request_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_request_id_seq OWNED BY public.request.request_id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    role_id integer NOT NULL,
    role_name character varying(255) NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_role_id_seq OWNER TO postgres;

--
-- Name: role_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_role_id_seq OWNED BY public.role.role_id;


--
-- Name: staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff (
    staff_id integer NOT NULL,
    role_id integer,
    name character varying(255) NOT NULL,
    username character varying(255),
    password_hash character varying(255) NOT NULL,
    email character varying(255),
    phone_no character varying(10)
);


ALTER TABLE public.staff OWNER TO postgres;

--
-- Name: staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_id_seq OWNER TO postgres;

--
-- Name: staff_staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_staff_id_seq OWNER TO postgres;

--
-- Name: staff_staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_staff_id_seq OWNED BY public.staff.staff_id;


--
-- Name: visitor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visitor (
    visitor_id integer NOT NULL,
    title character varying(5),
    f_name character varying(50) NOT NULL,
    l_name character varying(50) NOT NULL,
    phone character varying(12),
    email character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.visitor OWNER TO postgres;

--
-- Name: visitor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visitor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visitor_id_seq OWNER TO postgres;

--
-- Name: visitor_land; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visitor_land (
    visitor_land_id integer NOT NULL,
    visitor_id integer NOT NULL,
    province character varying(50),
    district character varying(50),
    city character varying(50),
    climate_zone character varying(50),
    land_shape character varying(50),
    has_water boolean,
    soil_type character varying(50),
    has_stones boolean,
    has_landslide_risk boolean,
    has_forestry boolean,
    land_size numeric(10,2)
);


ALTER TABLE public.visitor_land OWNER TO postgres;

--
-- Name: visitor_land_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visitor_land_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visitor_land_id_seq OWNER TO postgres;

--
-- Name: visitor_land_visitor_land_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visitor_land_visitor_land_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visitor_land_visitor_land_id_seq OWNER TO postgres;

--
-- Name: visitor_land_visitor_land_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visitor_land_visitor_land_id_seq OWNED BY public.visitor_land.visitor_land_id;


--
-- Name: visitor_visitor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visitor_visitor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visitor_visitor_id_seq OWNER TO postgres;

--
-- Name: visitor_visitor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visitor_visitor_id_seq OWNED BY public.visitor.visitor_id;


--
-- Name: customer customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer ALTER COLUMN customer_id SET DEFAULT nextval('public.customer_customer_id_seq'::regclass);


--
-- Name: customer_land customer_land_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_land ALTER COLUMN customer_land_id SET DEFAULT nextval('public.customer_land_customer_land_id_seq'::regclass);


--
-- Name: inventory inventory_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory ALTER COLUMN inventory_id SET DEFAULT nextval('public.inventory_inventory_id_seq'::regclass);


--
-- Name: message message_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message ALTER COLUMN message_id SET DEFAULT nextval('public.message_message_id_seq'::regclass);


--
-- Name: notification notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification ALTER COLUMN notification_id SET DEFAULT nextval('public.notification_notification_id_seq'::regclass);


--
-- Name: payment payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment ALTER COLUMN payment_id SET DEFAULT nextval('public.payment_payment_id_seq'::regclass);


--
-- Name: progress progress_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progress ALTER COLUMN progress_id SET DEFAULT nextval('public.progress_progress_id_seq'::regclass);


--
-- Name: project project_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project ALTER COLUMN project_id SET DEFAULT nextval('public.project_project_id_seq'::regclass);


--
-- Name: proposal proposal_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposal ALTER COLUMN proposal_id SET DEFAULT nextval('public.proposal_proposal_id_seq'::regclass);


--
-- Name: request request_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request ALTER COLUMN request_id SET DEFAULT nextval('public.request_request_id_seq'::regclass);


--
-- Name: role role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN role_id SET DEFAULT nextval('public.role_role_id_seq'::regclass);


--
-- Name: staff staff_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff ALTER COLUMN staff_id SET DEFAULT nextval('public.staff_staff_id_seq'::regclass);


--
-- Name: visitor visitor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitor ALTER COLUMN visitor_id SET DEFAULT nextval('public.visitor_visitor_id_seq'::regclass);


--
-- Name: visitor_land visitor_land_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitor_land ALTER COLUMN visitor_land_id SET DEFAULT nextval('public.visitor_land_visitor_land_id_seq'::regclass);


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (customer_id, title, name_with_ini, full_name, f_name, l_name, date_of_birth, nic_number, add_line_1, add_line_2, add_line_3, city, district, province, phone_no_1, phone_no_2, email, password_hash) FROM stdin;
2	Ms	P.P. Samarasinghe	Panchali Pabasari Samarasinghe	Panchali	Samarasinghe	2003-01-17	200351703728	199/4 Mayura Mw	Thalahena	Malabe	Malabe	Colombo	Western	+94703760789		panchalisam20030117@gmail.com	$2a$10$XdQzfp8xrANYYqJ3zYhX0.B5U.xZiIRa/Rr5Dd4hPUKm2UeYmZmPi
1	Ms	J.A. Doe	Jane Anne Doe	Jane	Doe	1985-06-15	856781234V	42 Palm Grove	Greenway Estate	Nugegoda	Colombo	Colombo	Western	+94712345678	+94112345678	jane@example.com	$2b$10$hGc5kKeeGbHPgJQrJWZSSOLtEljku.MMVjS3qQJh/3FN5eGc7EwvC
3	\N	J. Smith	John Smith	John	Smith	\N	123456789V	\N	\N	\N	\N	\N	\N	\N	\N	john.smith@example.com	$2b$10$Ma1J.DM7O0WD.OHGnoChP.E94kiaXAa03KMsRfIP4PJ3t7vCjUO8y
4	\N	J. Smith	John Smith	John	Smith	\N	123456789V	\N	\N	\N	\N	\N	\N	\N	\N	john.smith1234@example.com	$2b$10$ykR7eHCPTs.81OMfST2iYedRf5nM644fZaurFxp7gPxNr0FujCCAO
\.


--
-- Data for Name: customer_land; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_land (customer_land_id, customer_id, province, district, city, climate_zone, land_shape, has_water, soil_type, has_stones, has_landslide_risk, has_forestry, land_size) FROM stdin;
1	1	Central	Kandy	Peradeniya	mid country wet zone	Sloping	t	loamy	f	f	t	2.50
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (inventory_id, staff_id, item_name, item_type, quantity, price) FROM stdin;
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.message (message_id, f_name, l_name, email, phone_no, interested_in, message_text, status, is_read, created_at, updated_at) FROM stdin;
8	Kavinu	Senanayake	kavinusenanayake70@gmail.com	0789933355		fuerh weduiwefh	new	f	2025-05-15 12:53:15.224582	2025-05-15 12:53:15.224582
9	yihg	nhn	kavinusenanayake70@gmail.com	0789933355	tea-investment	guguy hbih	new	f	2025-05-15 12:55:58.479258	2025-05-15 12:55:58.479258
10	gvgub	njnjn	kavinusenanayake70@gmail.com	hgvghv	tea-investment	bjhgy jh	new	f	2025-05-15 12:56:53.536216	2025-05-15 12:56:53.536216
11	Nadun	Sooriyarachchi	nadunsoor404@gmail.com	+94771234567	agarwood	I am interested in learning more about your agarwood plantation investment	new	f	2025-05-15 14:18:57.590507	2025-05-15 14:18:57.590507
12	Kavinu	Senanayake	kavinusenanayake70@gmail.com	0765385065	vanilla-investment	i want vanilla	new	f	2025-05-15 14:43:41.411209	2025-05-15 14:43:41.411209
13	Ravindu	Fernando	ravindu@yahoo.com	0765385065	Agarwood Investment	1234	new	f	2025-05-16 10:07:19.924	2025-05-16 10:07:19.924
14	Ravindu	Bandara	ravindu@yahoo.com	0124578968	Other	aasdf	new	f	2025-05-17 08:01:00.291	2025-05-17 08:01:00.291
15	Ravindu	Bandara	ravindu@yahoo.com	0127458963	Plantation Visit	adsgdhjskjflld	new	f	2025-05-17 08:02:26.613	2025-05-17 08:02:26.613
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (notification_id, customer_id, staff_id, message, sent_date) FROM stdin;
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (payment_id, proposal_id, payment_date, amount, payment_detail, payment_receipt_url) FROM stdin;
\.


--
-- Data for Name: progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.progress (progress_id, project_id, phase, date, topic, description) FROM stdin;
\.


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project (project_id, staff_id, project_type, status, start_date, end_date, proposal_id) FROM stdin;
\.


--
-- Data for Name: proposal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proposal (proposal_id, customer_id, payment_mode, installment_count, installment_amount, proposal_date) FROM stdin;
\.


--
-- Data for Name: request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request (request_id, customer_id, request_details, request_date) FROM stdin;
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (role_id, role_name) FROM stdin;
1	Admin
2	Staff
\.


--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff (staff_id, role_id, name, username, password_hash, email, phone_no) FROM stdin;
2	1	System Admin	admin	$2b$10$/6rm3uOgHl3nmOQvfZdvPOPCKiyz8ceS.oFlyompyDFLmMu3YRxb2	admin@example.com
\.


--
-- Data for Name: visitor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visitor (visitor_id, title, f_name, l_name, phone, email, created_at) FROM stdin;
1	Mr	Kavinu	Senanayake	+94789933355	\N	2025-05-12 17:32:00.785
\.


--
-- Data for Name: visitor_land; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visitor_land (visitor_land_id, visitor_id, province, district, city, climate_zone, land_shape, has_water, soil_type, has_stones, has_landslide_risk, has_forestry, land_size) FROM stdin;
1	1	Central Province	Matale	\N	low country wet zone	Gentle Slope	\N	Sand	f	f	f	100.00
\.


--
-- Name: customer_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_customer_id_seq', 4, true);


--
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_id_seq', 1, false);


--
-- Name: customer_land_customer_land_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_land_customer_land_id_seq', 1, true);


--
-- Name: customer_land_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_land_id_seq', 1, false);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_id_seq', 1, false);


--
-- Name: inventory_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_inventory_id_seq', 1, false);


--
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.message_id_seq', 1, false);


--
-- Name: message_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.message_message_id_seq', 15, true);


--
-- Name: notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_id_seq', 1, false);


--
-- Name: notification_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_notification_id_seq', 1, false);


--
-- Name: payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_id_seq', 1, false);


--
-- Name: payment_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_payment_id_seq', 1, false);


--
-- Name: progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.progress_id_seq', 1, false);


--
-- Name: progress_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.progress_progress_id_seq', 1, false);


--
-- Name: project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_id_seq', 1, false);


--
-- Name: project_project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_project_id_seq', 1, false);


--
-- Name: proposal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proposal_id_seq', 1, false);


--
-- Name: proposal_proposal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proposal_proposal_id_seq', 1, false);


--
-- Name: request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_id_seq', 1, false);


--
-- Name: request_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_request_id_seq', 1, false);


--
-- Name: role_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_role_id_seq', 2, true);


--
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_id_seq', 1, false);


--
-- Name: staff_staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_staff_id_seq', 2, true);


--
-- Name: visitor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visitor_id_seq', 1, false);


--
-- Name: visitor_land_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visitor_land_id_seq', 1, false);


--
-- Name: visitor_land_visitor_land_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visitor_land_visitor_land_id_seq', 1, true);


--
-- Name: visitor_visitor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visitor_visitor_id_seq', 1, true);


--
-- Name: customer customer_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_email_key UNIQUE (email);


--
-- Name: customer_land customer_land_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_land
    ADD CONSTRAINT customer_land_pkey PRIMARY KEY (customer_land_id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (customer_id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (inventory_id);


--
-- Name: message message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (message_id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (notification_id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);


--
-- Name: progress progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_pkey PRIMARY KEY (progress_id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (project_id);


--
-- Name: proposal proposal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposal
    ADD CONSTRAINT proposal_pkey PRIMARY KEY (proposal_id);


--
-- Name: request request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_pkey PRIMARY KEY (request_id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);


--
-- Name: staff staff_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_email_key UNIQUE (email);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (staff_id);


--
-- Name: staff staff_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_username_key UNIQUE (username);


--
-- Name: visitor visitor_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitor
    ADD CONSTRAINT visitor_email_key UNIQUE (email);


--
-- Name: visitor_land visitor_land_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitor_land
    ADD CONSTRAINT visitor_land_pkey PRIMARY KEY (visitor_land_id);


--
-- Name: visitor visitor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitor
    ADD CONSTRAINT visitor_pkey PRIMARY KEY (visitor_id);


--
-- Name: idx_message_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_message_created_at ON public.message USING btree (created_at);


--
-- Name: idx_message_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_message_email ON public.message USING btree (email);


--
-- Name: customer_land customer_land_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_land
    ADD CONSTRAINT customer_land_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: project fk_project_proposal; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk_project_proposal FOREIGN KEY (proposal_id) REFERENCES public.proposal(proposal_id) ON DELETE SET NULL;


--
-- Name: inventory inventory_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id) ON DELETE SET NULL;


--
-- Name: notification notification_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: notification notification_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id) ON DELETE SET NULL;


--
-- Name: payment payment_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposal(proposal_id) ON DELETE CASCADE;


--
-- Name: progress progress_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(project_id) ON DELETE CASCADE;


--
-- Name: project project_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id) ON DELETE SET NULL;


--
-- Name: proposal proposal_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposal
    ADD CONSTRAINT proposal_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: request request_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: staff staff_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(role_id) ON DELETE SET NULL;


--
-- Name: visitor_land visitor_land_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitor_land
    ADD CONSTRAINT visitor_land_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitor(visitor_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

