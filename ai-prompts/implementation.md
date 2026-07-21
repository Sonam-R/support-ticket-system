# AI Prompts — Implementation

## Prompt Used

> Step 7 — Build React ticket UI with TicketList, TicketDetails, CreateTicket pages. Use minimal plain CSS. Server-side search and filter. Status actions from allowedTransitions.

## AI Response Summary

Created page components, shared components (TicketCard, TicketForm, StatusActions, CommentSection, ErrorMessage), global.css, and refactored away from Tailwind.

## Accepted

- Component structure matching assignment spec
- Debounced search calling backend API
- StatusActions driven by `allowedTransitions`
- ErrorMessage component for consistent error display

## Modified

- Removed Dashboard page (not in spec)
- Added inline edit on detail page for ticket updates
- Improved axios error interceptor with network failure message

## Rejected

- Material UI / component library suggestions
- Client-side filtering when backend supports search
- Complex loading spinners — kept simple text states
