# Navbar/Menu Management Manual QA Checklist

## Scope
- Validate navbar rendering, locking, and menu preference behavior for admin and end users.
- Validate changes persist across refresh and relogin.

## Preconditions
- Backend is running with test users and menu APIs enabled.
- At least two users exist:
  - `ROLE_ADMIN` user
  - `ROLE_USER` with plan `FREE_INDIVIDUAL`
- Test data includes at least one locked menu item and at least one hideable menu item.

---

## 1) Admin login → sees admin sections
- [ ] Sign in as `ROLE_ADMIN`.
- [ ] Open sidebar/menu.
- [ ] Verify admin-only sections/items are visible (for example admin menu management area).
- [ ] Open settings/admin menu management tab.
- [ ] Verify admin controls load without access errors.

**Expected**
- Admin can see admin sections and manage menu entries.
- No unexpected lock on admin-only functions for admin user.

---

## 2) User login (`FREE_INDIVIDUAL`) → sees only included entitlements
- [ ] Sign out from admin account.
- [ ] Sign in as `ROLE_USER` with `FREE_INDIVIDUAL` plan.
- [ ] Open sidebar/menu.
- [ ] Verify only entitled features are visible/clickable.
- [ ] Verify non-entitled features are not shown, or shown as locked only when configured to show-when-locked.

**Expected**
- Menu reflects entitlement-based visibility for `FREE_INDIVIDUAL`.
- No admin-only sections are visible to regular user.

---

## 3) Locked menu items behave correctly
- [ ] Identify an item with `locked=true` and `showWhenLocked=true`.
- [ ] Confirm item is visible in menu.
- [ ] Hover item and verify lock reason appears (tooltip/title), e.g. `PLAN_NOT_ALLOWED` or `DISABLED_BY_ORG`.
- [ ] Click locked item.
- [ ] Press Enter/Space on locked item (keyboard check).
- [ ] Identify a `readOnly=true` item and click it.

**Expected**
- Locked item does **not** navigate.
- Locked reason is visible on hover.
- Read-only item still allows navigation.

---

## 4) User preferences hide/show items
- [ ] As regular user, open **User Menu Preferences**.
- [ ] Toggle one visible item to hidden.
- [ ] Verify success behavior and immediate sidebar update.
- [ ] Refresh page; verify hidden state persists.
- [ ] Toggle same item back to visible.
- [ ] Verify item returns immediately and persists after refresh.
- [ ] Force an API failure case (if available in test env) and toggle item.

**Expected**
- On success, preference persists and sidebar updates immediately.
- On failure, toggle reverts and error notification is shown.
- Preferences affect only current user account.

---

## 5) Admin disables item → affected users see lock
- [ ] Sign in as admin.
- [ ] In admin menu management tab, set a target item `featureStatus=DISABLED` (and reason).
- [ ] Save and verify success notification.
- [ ] Sign out and sign in as affected regular user.
- [ ] Open sidebar and locate target item.

**Expected**
- Affected user sees the item locked (or hidden per configuration), with lock reason available.
- Item does not navigate when locked.

---

## 6) Refresh + relogin checks
- [ ] While logged in as regular user, perform browser refresh.
- [ ] Verify navbar/menu remains consistent with latest admin + preference state.
- [ ] Sign out and sign in again as same user.
- [ ] Verify same menu state persists.
- [ ] Repeat quick check with admin account.

**Expected**
- Menu state is stable across refresh and relogin.
- No stale entries from previous user session.

---

## Defect Notes
- [ ] Capture screenshot/video when behavior differs from expected.
- [ ] Record user role, plan, item key, and exact observed behavior.
- [ ] Include browser, timestamp, and reproduction steps.
