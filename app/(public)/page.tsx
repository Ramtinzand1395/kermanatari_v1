import { fetcher } from "@/helpers/fetcher";
import Hero from "./components/Hero";
import DiscountTimer from "./components/slider/DiscountTimer";
import SliderContainer from "./components/slider/SliderContainer";

const now = new Date();
const nextMidnight = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() + 1,
  0,
  0,
  0
);
export default async function Home() {
  const [discountedProducts,
    //  consoles, games, gamingAccessories, accessories
    ] =
    await Promise.all([
      fetcher("/api/products?discount=true"),

    ]);
  return (
    <div>
      <Hero />
      <div className="mx-2 md:mx-10">
        {/* اسلایدر تخفیف */}
        <SliderContainer
          games={discountedProducts}
          title="تخفیف امروز"
          subtitle={<DiscountTimer endDate={nextMidnight.toISOString()} />}
        />
      </div>
    </div>
  );
};

