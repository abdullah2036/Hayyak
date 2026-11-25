import Landing from '@/screens/Landing';
import { publicPricing } from '@/server/services/pricing';

export default async function Page() {
  // The landing page stays up even if the database does not answer; it then shows the starting prices.
  const pricing = await publicPricing().catch(() => null);
  return <Landing pricing={pricing} />;
}
