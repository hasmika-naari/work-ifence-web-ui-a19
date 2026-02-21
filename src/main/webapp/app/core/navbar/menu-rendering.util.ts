export interface MenuRenderableItem {
  route?: string;
  locked?: boolean;
  showWhenLocked?: boolean;
  readOnly?: boolean;
  lockReason?: string;
}

export interface MenuBadge {
  type: 'lock' | 'readOnly';
  label: string;
  tooltip?: string;
}

export interface MenuClickableOptions {
  allowReadOnlyNavigation?: boolean;
  requireRoute?: boolean;
}

export function isVisible(item: MenuRenderableItem): boolean {
  return !(item.locked === true && item.showWhenLocked === false);
}

export function isClickable(item: MenuRenderableItem, options: MenuClickableOptions = {}): boolean {
  if (!isVisible(item)) {
    return false;
  }

  const requireRoute = options.requireRoute ?? true;
  const allowReadOnlyNavigation = options.allowReadOnlyNavigation ?? false;

  if (item.locked === true) {
    return false;
  }

  if (item.readOnly === true && !allowReadOnlyNavigation) {
    return false;
  }

  return requireRoute ? !!item.route : true;
}

export function itemBadges(item: MenuRenderableItem): MenuBadge[] {
  const badges: MenuBadge[] = [];

  if (item.locked === true && item.showWhenLocked !== false) {
    badges.push({
      type: 'lock',
      label: 'Locked',
      tooltip: item.lockReason || 'Locked feature',
    });
  }

  if (item.readOnly === true) {
    badges.push({
      type: 'readOnly',
      label: 'Read Only',
    });
  }

  return badges;
}
