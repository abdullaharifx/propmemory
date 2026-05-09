# Demo Account Setup

The login page has a **"Try demo"** button that signs in with `demo@propmemory.com / demo1234` and lands the user on a pre-seeded dashboard with 10 properties. Follow these steps to set it up.

---

## Step 1 — Create the demo user

1. Go to your Supabase project → **Authentication → Users**
2. Click **Add user → Create new user**
3. Enter:
   - Email: `demo@propmemory.com`
   - Password: `demo1234`
   - Check **Auto Confirm User** (so the user doesn't need email verification)
4. Click **Create user** and copy the new user's UUID

---

## Step 2 — Create the profile row

In the **SQL Editor**, run:

```sql
insert into profiles (id, full_name, email)
values (
  '<paste-user-uuid-here>',
  'Demo User',
  'demo@propmemory.com'
);
```

---

## Step 3 — Seed the 10 sample properties

Replace `<paste-user-uuid-here>` with the demo user's UUID in each row, then run this in the SQL Editor:

```sql
insert into properties (landlord_id, address, unit_identifier, tenant_name, tenant_email,
  rent_amount, rent_currency, lease_start, lease_end, deposit, notice_period_months,
  pets_allowed, parking, landlord_notes, status)
values
  ('<paste-user-uuid-here>', '14 Ashwood Lane', 'Flat 1', 'James Whitfield', 'james.whitfield@email.com',
   1250, 'GBP', '2023-03-01', '2026-02-28', 1250, 1, 'No', 'No',
   'Long-term tenant — very reliable payer', 'active'),

  ('<paste-user-uuid-here>', '22 Birchfield Road', null, 'Sarah Okonkwo', 'sarah.o@gmail.com',
   950, 'GBP', '2023-06-01', '2025-05-31', 950, 1, 'Yes - small dog', 'No',
   'Dog approved in tenancy agreement. Lease due May.', 'active'),

  ('<paste-user-uuid-here>', '8 Chestnut Avenue', 'Flat 3', 'Marcus Webb', 'marcus.webb@email.co.uk',
   1100, 'GBP', '2022-09-15', '2024-09-14', 2200, 2, 'No', 'Yes',
   'Parking space 12. Lease expired — needs renewal conversation.', 'active'),

  ('<paste-user-uuid-here>', '35 Drummond Street', null, 'Priya Sharma', 'priya.sharma@hotmail.com',
   1400, 'GBP', '2024-01-01', '2025-12-31', 1400, 1, 'No', 'No',
   'Professional tenant. Works in finance. Very tidy.', 'active'),

  ('<paste-user-uuid-here>', '19 Elmwood Close', 'Apt B', 'Tom Fletcher', 't.fletcher@outlook.com',
   875, 'GBP', '2023-08-01', '2025-07-31', 1750, 1, 'No', 'Street only',
   'Quiet tenant — no complaints from neighbours.', 'active'),

  ('<paste-user-uuid-here>', '6 Fairfield Terrace', null, 'Aisha Noor', null,
   1350, 'GBP', '2024-04-15', '2026-04-14', 2700, 2, 'Yes - cat', 'No',
   'Missing email — pays by standing order. Cat approved.', 'active'),

  ('<paste-user-uuid-here>', '44 Greengate Road', 'Ground Floor', 'David Chen', 'david.chen@gmail.com',
   1050, 'GBP', '2023-10-01', '2025-09-30', 1050, 1, 'No', 'Yes',
   'Corporate let. Key holder is Mrs Patel next door.', 'active'),

  ('<paste-user-uuid-here>', '11 Hawthorn Rise', null, null, 'natalie.burns@yahoo.co.uk',
   800, 'GBP', '2024-02-01', '2026-01-31', 800, 1, 'No', 'No',
   'Tenant name missing from original records — email only.', 'active'),

  ('<paste-user-uuid-here>', '29 Ivybridge Court', 'Flat 7', 'Oliver Marsh', 'o.marsh@btinternet.com',
   1625, 'GBP', '2022-05-01', '2025-04-30', 3250, 3, 'No', 'Yes',
   'Premium tenant. Corporate let. Long 3-month notice period agreed.', 'active'),

  ('<paste-user-uuid-here>', '55 Jasmine Walk', null, 'Fatima Al-Hassan', 'fatima.alhassan@gmail.com',
   990, 'GBP', '2023-11-01', '2025-10-31', 990, 1, 'No', 'No',
   'Recently moved in. First full payment December 2023.', 'active');
```

---

## Step 4 — Add some payment history (optional but recommended for demo)

```sql
-- James Whitfield — all on time
insert into payment_history (property_id, month, year, status, amount_paid, date_paid)
select id, 3, 2025, 'on-time', 1250, '2025-03-01' from properties
where tenant_name = 'James Whitfield' and landlord_id = '<paste-user-uuid-here>';

insert into payment_history (property_id, month, year, status, amount_paid, date_paid)
select id, 2, 2025, 'on-time', 1250, '2025-02-03' from properties
where tenant_name = 'James Whitfield' and landlord_id = '<paste-user-uuid-here>';

-- Marcus Webb — late + missed (interesting for AI demo)
insert into payment_history (property_id, month, year, status, amount_paid, date_paid, notes)
select id, 3, 2025, 'late', 1100, '2025-03-14', 'Paid 14 days late' from properties
where tenant_name = 'Marcus Webb' and landlord_id = '<paste-user-uuid-here>';

insert into payment_history (property_id, month, year, status, amount_paid, date_paid)
select id, 2, 2025, 'missed', null, null from properties
where tenant_name = 'Marcus Webb' and landlord_id = '<paste-user-uuid-here>';
```

---

## Step 5 — Verify

1. Visit your app → click **Try demo**
2. You should land on the Dashboard with 10 properties
3. Click into Marcus Webb's property → open Chat → ask "Draft a rent reminder"
4. The AI should reference his payment history in its response

---

## Resetting the demo

To reset the demo account to a clean state (e.g. after a presentation):

```sql
-- Delete all data for the demo user (cascade handles related tables)
delete from properties where landlord_id = '<paste-user-uuid-here>';
```

Then re-run Step 3 to re-seed.
