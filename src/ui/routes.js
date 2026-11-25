// Maps the page names used in the design to real addresses.
export const ROUTES = {
  'LuxC.dc.html': '/',
  'Signup.dc.html': '/signup',
  'Privacy.dc.html': '/privacy',
  'Terms.dc.html': '/terms',
  'Dashboard.dc.html': '/app',
  'Invitations.dc.html': '/app/invitations',
  'Create.dc.html': '/app/create',
  'Designs.dc.html': '/app/designs',
  'Guests.dc.html': '/app/guests',
  'Requests.dc.html': '/app/requests',
  'Settings.dc.html': '/app/settings',
  'Account.dc.html': '/app/account',
  'Subscribe.dc.html': '/app/buy',
  'Report.dc.html': '/app/report',
  'Attendance.dc.html': '/app/invitations',
  'Certificate.dc.html': '/app/invitations',
  'GuestJourney.dc.html': '/app/invitations',
  'InviteDetail.dc.html': '/app/invitations',
};

export function resolve(href) {
  return (typeof href === 'string' && ROUTES[href]) || href;
}
