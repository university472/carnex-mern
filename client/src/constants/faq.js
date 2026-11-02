// client/src/constants/faq.js
// Homepage FAQ content. Edit the questions/answers here — the accordion on
// the homepage renders whatever is in this list. `link` is optional and must
// point at an existing public route.
import { DEALERSHIP, BUSINESS_HOURS } from './index'

const hoursSummary = BUSINESS_HOURS.map((h) => `${h.day}: ${h.hours}`).join(
  ' · '
)

export const FAQ_ITEMS = [
  {
    question: 'Do you offer financing for all credit types?',
    answer:
      'Yes. Whether you have excellent credit, are rebuilding your credit, or are a first-time buyer, our finance team works with a network of U.S. lenders to find terms that fit your budget. You can start the pre-approval process online.',
    link: { label: 'Apply for financing', to: '/financing' }
  },
  {
    question: 'Can I trade in my current vehicle?',
    answer:
      'Absolutely. Tell us about your vehicle and we will provide an estimated value based on current U.S. market conditions, so you can plan how much equity to apply toward your next car.',
    link: { label: 'Value your trade-in', to: '/trade-in' }
  },
  {
    question: 'How do I schedule a test drive?',
    answer:
      'Send us a test drive request with the vehicle you are interested in and your preferred time. Our team will reach out to confirm your appointment.',
    link: { label: 'Book a test drive', to: '/test-drive' }
  },
  {
    question: "Can you find a car that isn't in your inventory?",
    answer:
      "Yes. Tell us what you're looking for and we'll search U.S. auctions and partner dealers to find the right fit for you.",
    link: { label: 'Request a vehicle', to: '/sourcing' }
  },
  {
    question: 'Are your vehicles inspected?',
    answer:
      'Every Carnex vehicle is carefully inspected by our dealership team before it is listed, so you can shop with confidence.'
  },
  {
    question: 'Are there any hidden fees?',
    answer:
      'No hidden dealer fees. Tag, title and document fees vary by vehicle and state and are calculated transparently at the time of purchase.'
  },
  {
    question: 'Is a vehicle history report available?',
    answer:
      'When a CARFAX report is available for a vehicle, you will find a "Show me the CARFAX" button on that vehicle\'s detail page.',
    link: { label: 'Browse inventory', to: '/inventory' }
  },
  {
    question: 'Where are you located and when are you open?',
    answer: `${DEALERSHIP.name}, ${DEALERSHIP.addressLine1}, ${DEALERSHIP.addressLine2}. Hours — ${hoursSummary}.`,
    link: { label: 'Contact us', to: '/contact' }
  }
]
