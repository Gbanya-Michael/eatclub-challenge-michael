import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import LoadingCard from "./LoadingCard";
import Toast from "./Toast";
import { ApiService } from "../services/ApiService";

export default function Home() {
  const [allRestaurants, setAllRestaurants] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const { fetchRestaurantData } = ApiService;

  const logo = "/eatclub-logo.jpeg";

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getBestDiscount = (restaurant) => {
    if (!restaurant?.deals?.length)
      return { discount: 0, starts: null, dineIn: false };

    const bestDeal = restaurant.deals.reduce((best, deal) => {
      const discountValue = Number(deal.discount);
      const bestDiscount = Number(best.discount);

      if (Number.isFinite(discountValue) && discountValue > bestDiscount) {
        return deal;
      }
      return best;
    }, restaurant.deals[0]);

    const discount = Number(bestDeal.discount) || 0;
    const starts = bestDeal.start || bestDeal.open || null;
    const dineIn = bestDeal.dineIn === "true" || bestDeal.dineIn === true;

    return { discount, starts, dineIn };
  };

  const sortByBestDeal = (restaurants) => {
    if (!Array.isArray(restaurants)) return [];
    return [...restaurants].sort(
      (a, b) => getBestDiscount(b).discount - getBestDiscount(a).discount
    );
  };

  const filterRestaurants = (restaurants, query) => {
    if (!query.trim()) return restaurants;

    const lowerQuery = query.toLowerCase().trim();

    return restaurants.filter((restaurant) => {
      const nameMatch = restaurant.name?.toLowerCase().includes(lowerQuery);

      const cuisineMatch = restaurant.cuisines?.some((cuisine) =>
        cuisine.toLowerCase().includes(lowerQuery)
      );

      return nameMatch || cuisineMatch;
    });
  };

  const toggleFavorite = (restaurantId) => {
    setAllRestaurants((prevRestaurants) => {
      if (!prevRestaurants) return prevRestaurants;

      return prevRestaurants.map((restaurant) => {
        if (restaurant.objectId === restaurantId) {
          const newFavoriteStatus = !restaurant.isFavourite;

          if (newFavoriteStatus) {
            setToastMessage(`${restaurant.name} added to favourite list`);
            setToastType("success");
          } else {
            setToastMessage(`${restaurant.name} removed from favourite list`);
            setToastType("error");
          }
          setShowToast(true);

          return {
            ...restaurant,
            isFavourite: newFavoriteStatus,
          };
        }
        return restaurant;
      });
    });
  };

  const filteredData = useMemo(() => {
    if (!allRestaurants) return null;
    return filterRestaurants(allRestaurants, searchQuery);
  }, [allRestaurants, searchQuery]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchRestaurantData();
        const restaurants = sortByBestDeal(res.restaurants);
        setAllRestaurants(restaurants);
        setIsLoading(false);
      } catch (err) {
        setToastMessage(`Error: ${err.message}`);
        setToastType("error");
        setShowToast(true);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <div className="w-full">
        {allRestaurants && !isLoading && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CD4637] focus:border-transparent"
              />
            </div>
          </div>
        )}

        {filteredData && !isLoading ? (
          filteredData.length > 0 ? (
            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredData.map((r) => {
                const imageSrc = r.imageLink ? r.imageLink : logo;
                const bestDeal = getBestDiscount(r);
                return (
                  <li key={r.objectId}>
                    <Link
                      to={`/restaurant/${r.objectId}`}
                      className="block cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <div className=" relative w-full h-48 mb-2 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={imageSrc}
                          alt={r.name}
                          className={`w-full h-full rounded-lg ${
                            imageSrc === logo
                              ? "object-contain p-4"
                              : "object-cover"
                          }`}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = logo;
                            e.currentTarget.classList.remove("object-cover");
                            e.currentTarget.classList.add(
                              "object-contain",
                              "p-4"
                            );
                          }}
                        />
                        {r.deals && r.deals.length > 0 && (
                          <div className=" bg-[#CD4637] absolute top-3 left-3 right-0 h-fit w-fit rounded-sm text-gray-200 p-1">
                            <h3 className=" text-sm -mb-1 font-semibold">
                              <span>{bestDeal.discount}% off</span>

                              {bestDeal.dineIn ? " - Dine In" : " "}
                            </h3>
                            <div className="text-xs">
                              {bestDeal.starts ? (
                                <p>Arrive before {bestDeal.starts}</p>
                              ) : (
                                <p>Anytime today</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <h1 className="text-gray-900 font-bold">{r.name}</h1>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(r.objectId);
                          }}
                          className="hover:opacity-70 transition-opacity"
                        >
                          <Heart
                            className={
                              r.isFavourite ? "text-red-500" : "text-gray-400"
                            }
                            fill={r.isFavourite ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        <span>0.5km Away</span>{" "}
                        <span>{capitalizeWords(r.suburb)}</span>
                      </p>
                      <div className="flex flex-wrap  text-gray-500">
                        {r.cuisines.map((c, index) => (
                          <span key={index} className="flex">
                            {capitalizeWords(c)}
                            {index < r.cuisines.length - 1 && ","}
                          </span>
                        ))}
                      </div>
                      <div>
                        {!bestDeal.dineIn && (
                          <ul className="flex items-center gap-5 list-disc text-gray-500 list-outside">
                            <li className="list-none">Dining</li>
                            <li>Takeaway</li>
                            <li>Order Online</li>
                          </ul>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No restaurants found</p>
              <p className="text-sm mt-2">
                Try searching with a different name or cuisine
              </p>
            </div>
          )
        ) : (
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <li key={index}>
                <LoadingCard
                  isLoading={isLoading}
                  height="300px"
                  width="100%"
                  waveLines={3}
                  className="w-full"
                />
              </li>
            ))}
          </ol>
        )}
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
