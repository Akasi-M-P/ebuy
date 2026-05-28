-- Enable Row Level Security on all tables.
-- Prisma connects as the postgres superuser which bypasses RLS,
-- so server-side queries are unaffected. This blocks direct Supabase
-- REST/JS API access to raw table data using the anon key.

ALTER TABLE "User"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductVariant"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Coupon"            ENABLE ROW LEVEL SECURITY;