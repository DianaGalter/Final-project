const GUEST_KEY = 'guestId';

export const getOrCreateGuestId = (): string => {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(GUEST_KEY);
  if (!id) {
    id = `guest_${crypto.randomUUID()}`;
    localStorage.setItem(GUEST_KEY, id);
  }
  return id;
};
