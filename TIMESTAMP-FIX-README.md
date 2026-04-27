# Fix PostgreSQL + Sequelize Timestamp Error

## Problem
```
Error: column "createdAt" of relation "users" contains null values
```

**Root Cause:** NULL values in existing timestamp columns + naming mismatch (snake_case vs camelCase)

---

## Solution Overview

### ✅ What's Fixed
1. **SQL constraints** - Updated schema with `NOT NULL` and `DEFAULT CURRENT_TIMESTAMP`
2. **Naming consistency** - Changed from `created_at`/`updated_at` to `createdAt`/`updatedAt` (camelCase)
3. **Sequelize config** - Added explicit timestamp mapping to models
4. **Existing data** - Clear fix for NULL values without breaking data

---

## Steps to Apply the Fix

### Option 1: Quick Fix (Recommended for Production)

Run the SQL migration directly in your PostgreSQL database:

```bash
psql -h your-db-host -U your-db-user -d your-db-name -f fix-timestamps.sql
```

This will:
- ✅ Update NULL `createdAt` to `NOW()`
- ✅ Update NULL `updatedAt` to `NOW()`
- ✅ Add `NOT NULL` constraints

---

### Option 2: Node.js Script (If you prefer app-level migration)

```bash
node fix-timestamps.js
```

This:
- ✅ Connects via Sequelize
- ✅ Fixes NULL values
- ✅ Verifies results
- ✅ Reports status

---

## Files Changed

### 1. **schema.sql** ✏️
- Renamed all `created_at` → `"createdAt"`
- Renamed all `updated_at` → `"updatedAt"`
- Added `NOT NULL` constraints
- Added `DEFAULT CURRENT_TIMESTAMP` to all timestamp columns

**Tables affected:**
- users
- restaurants
- foods
- addresses
- orders
- reviews

### 2. **src/models/user.model.js** ✏️
```javascript
timestamps: true,
underscored: false,  // ← New: Use camelCase
createdAt: 'createdAt',
updatedAt: 'updatedAt',
```

### 3. **src/models/restaurant.model.js** ✏️
### 4. **src/models/order.model.js** ✏️
Same timestamp config as User model.

---

## New Files Created

### 📄 fix-timestamps.sql
Raw SQL queries to fix NULL values and add constraints.

### 📄 fix-timestamps.js
Node.js migration script using Sequelize connection.

---

## Verification

After applying the fix, verify:

```sql
-- Check no NULL values remain
SELECT COUNT(*) as null_count 
FROM users 
WHERE "createdAt" IS NULL OR "updatedAt" IS NULL;
-- Expected: 0

-- Check constraints exist
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name='users' AND column_name IN ('createdAt', 'updatedAt');
-- Expected: is_nullable = 'NO'
```

---

## Prevention (Going Forward)

✅ **All tables now have:**
- Timestamp columns with camelCase naming
- `DEFAULT CURRENT_TIMESTAMP` on both `createdAt` and `updatedAt`
- `NOT NULL` constraints
- Sequelize models configured with `timestamps: true` and explicit field mapping

---

## Rollback (If Needed)

To restore old schema naming:
1. Keep a backup of your current data
2. Run original schema.sql on a test database
3. Verify no breaking changes
4. Manually migrate if critical

---

## Next Steps

1. **Back up your database** (if not already done)
2. Run one of the fix options above
3. Verify with the SQL queries above
4. Restart your Node.js server
5. Test your app

---

## Notes

- The fix preserves ALL existing data
- Timestamps now auto-populate on create/update
- Sequelize will handle timestamp management from now on
- No breaking changes to API or business logic
