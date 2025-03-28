-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role character varying(255) COLLATE pg_catalog."default" NOT NULL,
    profile_picture character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_role_check CHECK (role::text = ANY (ARRAY['USER'::character varying::text, 'ORGANIZER'::character varying::text, 'ADMIN'::character varying::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;
-- Table: public.likes

-- DROP TABLE IF EXISTS public.likes;

CREATE TABLE IF NOT EXISTS public.likes
(
    id uuid NOT NULL,
    user_id uuid,
    event_id uuid,
    type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT likes_pkey PRIMARY KEY (id),
    CONSTRAINT likes_event_id_fkey FOREIGN KEY (event_id)
        REFERENCES public.events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT likes_type_check CHECK (type::text = ANY (ARRAY['LIKE'::character varying::text, 'DISLIKE'::character varying::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.likes
    OWNER to postgres;
-- Table: public.follows

-- DROP TABLE IF EXISTS public.follows;

CREATE TABLE IF NOT EXISTS public.follows
(
    id uuid NOT NULL,
    follower_id uuid,
    followed_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT follows_pkey PRIMARY KEY (id),
    CONSTRAINT follows_followed_id_fkey FOREIGN KEY (followed_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.follows
    OWNER to postgres;
-- Table: public.events

-- DROP TABLE IF EXISTS public.events;

CREATE TABLE IF NOT EXISTS public.events
(
    id uuid NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    location character varying(255) COLLATE pg_catalog."default" NOT NULL,
    date timestamp without time zone NOT NULL,
    image character varying(255) COLLATE pg_catalog."default",
    organizer_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT events_pkey PRIMARY KEY (id),
    CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.events
    OWNER to postgres;
-- Table: public.event_categories

-- DROP TABLE IF EXISTS public.event_categories;

CREATE TABLE IF NOT EXISTS public.event_categories

(
    event_id uuid NOT NULL,
    category_id uuid NOT NULL,
    CONSTRAINT event_categories_pkey PRIMARY KEY (event_id, category_id),
    CONSTRAINT event_categories_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES public.categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT event_categories_event_id_fkey FOREIGN KEY (event_id)
        REFERENCES public.events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.event_categories
    OWNER to postgres;
-- Table: public.comments

-- DROP TABLE IF EXISTS public.comments;

CREATE TABLE IF NOT EXISTS public.comments
(
    id uuid NOT NULL,
    user_id uuid,
    event_id uuid,
    comment character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comments_pkey PRIMARY KEY (id),
    CONSTRAINT comments_event_id_fkey FOREIGN KEY (event_id)
        REFERENCES public.events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.comments
    OWNER to postgres;
-- Table: public.categories

-- DROP TABLE IF EXISTS public.categories;

CREATE TABLE IF NOT EXISTS public.categories
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT categories_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.categories
    OWNER to postgres;













    ---------------------- DUMMY DATA ---------------------
INSERT INTO public.categories (id, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Music'),
    ('22222222-2222-2222-2222-222222222222', 'Sports'),
    ('33333333-3333-3333-3333-333333333333', 'Technology'),
    ('44444444-4444-4444-4444-444444444444', 'Food'),
    ('55555555-5555-5555-5555-555555555555', 'Art');



INSERT INTO public.users (id, name, email, password, role, profile_picture, created_at) VALUES
    -- Admin
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin User', 'admin@example.com', '$2a$10$xJwL5vxJZ5jzL5Z5zL5Z5e', 'ADMIN', 'https://example.com/profiles/admin.jpg', '2023-01-01 10:00:00'),

    -- Organizers
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Music Festival Org', 'music@events.com', '$2a$10$xJwL5vxJZ5jzL5Z5zL5Z5e', 'ORGANIZER', 'https://example.com/profiles/music.jpg', '2023-01-15 11:00:00'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Tech Conference Org', 'tech@events.com', '$2a$10$xJwL5vxJZ5jzL5Z5zL5Z5e', 'ORGANIZER', 'https://example.com/profiles/tech.jpg', '2023-02-01 09:00:00'),

    -- Regular users
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'John Doe', 'john@example.com', '$2a$10$xJwL5vxJZ5jzL5Z5zL5Z5e', 'USER', 'https://example.com/profiles/john.jpg', '2023-02-10 14:00:00'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Jane Smith', 'jane@example.com', '$2a$10$xJwL5vxJZ5jzL5Z5zL5Z5e', 'USER', 'https://example.com/profiles/jane.jpg', '2023-02-15 16:00:00');



INSERT INTO public.events (id, title, description, location, date, image, organizer_id, category) VALUES
    -- Music events
    ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Summer Music Festival', 'Annual outdoor music festival', 'Central Park, NY', '2023-06-15 12:00:00', 'https://example.com/events/music-fest.jpg', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Music'),
    ('a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 'Jazz Night', 'Evening of smooth jazz', 'Blue Note Club, NY', '2023-06-20 20:00:00', 'https://example.com/events/jazz-night.jpg', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Music'),

    -- Tech events
    ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'Tech Conference 2023', 'Annual technology conference', 'Convention Center, SF', '2023-07-10 09:00:00', 'https://example.com/events/tech-conf.jpg', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Technology'),
    ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'AI Workshop', 'Hands-on AI workshop', 'Tech Hub, SF', '2023-07-15 13:00:00', 'https://example.com/events/ai-workshop.jpg', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Technology'),

    -- Sports event
    ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'City Marathon', 'Annual city marathon', 'Downtown, Chicago', '2023-08-05 07:00:00', 'https://example.com/events/marathon.jpg', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sports');



INSERT INTO public.event_categories (event_id, category_id) VALUES
    -- Music Festival belongs to Music and Food
    ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '11111111-1111-1111-1111-111111111111'),
    ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '44444444-4444-4444-4444-444444444444'),

    -- Tech Conference belongs to Technology
    ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', '33333333-3333-3333-3333-333333333333'),

    -- AI Workshop belongs to Technology and Art
    ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', '33333333-3333-3333-3333-333333333333'),
    ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', '55555555-5555-5555-5555-555555555555');


INSERT INTO public.follows (id, follower_id, followed_id) VALUES
    -- John follows organizers
    ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),

    -- Jane follows John and music organizer
    ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
    ('f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f4f4', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');


INSERT INTO public.likes (id, user_id, event_id, type) VALUES
    -- John likes music events
    ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'LIKE'),
    ('22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 'LIKE'),

    -- Jane likes tech events and dislikes marathon
    ('33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'LIKE'),
    ('44444444-4444-4444-4444-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'DISLIKE');


INSERT INTO public.comments (id, user_id, event_id, comment) VALUES
    -- Comments on music festival
    ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Cant wait for this!'),
    ('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Who is performing this year?'),

    -- Comment on tech conference
    ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'Will there be workshops on AI?');