-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  created_at timestamp with time zone default now()
);

-- PROPERTIES
create table properties (
  id uuid default uuid_generate_v4() primary key,
  landlord_id uuid references profiles(id) on delete cascade not null,
  address text not null,
  unit_identifier text,
  tenant_name text,
  tenant_email text,
  rent_amount numeric(10,2),
  rent_currency text default 'GBP',
  lease_start date,
  lease_end date,
  deposit numeric(10,2),
  notice_period_months integer default 1,
  pets_allowed text default 'No',
  parking text default 'No',
  landlord_notes text,
  status text default 'active' check (status in ('active', 'vacant', 'archived')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- PAYMENT HISTORY
create table payment_history (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties(id) on delete cascade not null,
  month integer not null check (month between 1 and 12),
  year integer not null,
  status text not null check (status in ('on-time', 'late', 'missed', 'partial')),
  amount_paid numeric(10,2),
  date_paid date,
  notes text,
  created_at timestamp with time zone default now()
);

-- MAINTENANCE LOG
create table maintenance_log (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'open' check (status in ('open', 'in-progress', 'resolved')),
  type text default 'issue' check (type in ('issue', 'repair', 'inspection', 'other')),
  contractor text,
  cost numeric(10,2),
  logged_date date default current_date,
  resolved_date date,
  created_at timestamp with time zone default now()
);

-- ACTIVITY LOG (auto-generated record of everything)
create table activity_log (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties(id) on delete cascade not null,
  type text not null check (type in ('message_sent', 'message_draft', 'issue_logged',
                                      'payment_logged', 'note_added', 'system', 'lease_event')),
  description text not null,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- CHAT HISTORY (per property, persists across sessions)
create table chat_history (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- ROW LEVEL SECURITY
alter table profiles enable row level security;
alter table properties enable row level security;
alter table payment_history enable row level security;
alter table maintenance_log enable row level security;
alter table activity_log enable row level security;
alter table chat_history enable row level security;

-- POLICIES (landlord can only see their own data)
create policy "Landlords own their profile"
  on profiles for all using (auth.uid() = id);

create policy "Landlords own their properties"
  on properties for all using (auth.uid() = landlord_id);

create policy "Landlords own payment history"
  on payment_history for all using (
    auth.uid() = (select landlord_id from properties where id = property_id)
  );

create policy "Landlords own maintenance log"
  on maintenance_log for all using (
    auth.uid() = (select landlord_id from properties where id = property_id)
  );

create policy "Landlords own activity log"
  on activity_log for all using (
    auth.uid() = (select landlord_id from properties where id = property_id)
  );

create policy "Landlords own chat history"
  on chat_history for all using (
    auth.uid() = (select landlord_id from properties where id = property_id)
  );

-- AUTO-UPDATE updated_at ON PROPERTIES
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger properties_updated_at
  before update on properties
  for each row execute function update_updated_at();
