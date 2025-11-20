import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Star,
  MenuSquare,
  PhoneCall,
  MapPinned,
  Clock,
  MapPin,
} from "lucide-react";
import Container from "../components/Container";
import Header from "../components/Header";
import Toast from "../components/Toast";
import { ApiService } from "../services/ApiService";

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasValidImage, setHasValidImage] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const { fetchRestaurantData } = ApiService;
  const logo = "/eatclub-logo.jpeg";

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setIsLoading(true);
        const res = await fetchRestaurantData();
        const foundRestaurant = res.restaurants.find((r) => r.objectId === id);

        if (!foundRestaurant) {
          setError("Restaurant not found");
          setToastMessage("Restaurant not found");
          setToastType("error");
          setShowToast(true);
          return;
        }

        setRestaurant(foundRestaurant);
        setHasValidImage(false);
      } catch (err) {
        setError(err.message);
        setToastMessage(`Error: ${err.message}`);
        setToastType("error");
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadRestaurant();
    }
  }, [id]);

  useEffect(() => {
    if (restaurant && restaurant.imageLink) {
      const img = new Image();
      img.onload = () => {
        setHasValidImage(true);
      };
      img.onerror = () => {
        setHasValidImage(false);
      };
      img.src = restaurant.imageLink;
    } else {
      setHasValidImage(false);
    }
  }, [restaurant]);

  if (isLoading) {
    return (
      <Container>
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Container>
    );
  }

  if (error || !restaurant) {
    return (
      <Container>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#CD4637] text-white rounded-lg hover:bg-[#B03A2E] transition"
          >
            Go Back
          </button>
        </div>
        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            duration={3000}
            onClose={() => setShowToast(false)}
          />
        )}
      </Container>
    );
  }

  const imageSrc = restaurant.imageLink ? restaurant.imageLink : logo;

  return (
    <Container>
      <Header />
      <div className="w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="relative w-full h-64 mb-6 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          <img
            src={imageSrc}
            alt={restaurant.name}
            className={`w-full h-full rounded-lg ${
              imageSrc === logo ? "object-contain p-4" : "object-cover"
            }`}
            onLoad={(e) => {
              if (imageSrc !== logo) {
                const loadedSrc = e.currentTarget.src;
                if (!loadedSrc.includes("eatclub-logo.jpeg")) {
                  setHasValidImage(true);
                }
              }
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = logo;
              e.currentTarget.classList.remove("object-cover");
              e.currentTarget.classList.add("object-contain", "p-4");
              setHasValidImage(false);
            }}
          />
          {restaurant.imageLink && hasValidImage && (
            <div className="bg-[#E3333D] absolute top-3 right-3 h-5 w-fit rounded-sm text-gray-200 p-1 flex items-center justify-center text-xs font-semibold">
              <Star className="w-3 h-3 mr-1 fill-white" />
              <span className="text-sm ">New</span>
            </div>
          )}
        </div>
        <div className="border-b border-gray-400 pb-4">
          <div className="text-gray-700 text-xs flex items-center justify-between md:justify-start gap-6 md:gap-12  max-w-[90%] mx-auto">
            <div className="flex flex-col items-center justify-center">
              <MenuSquare className="w-8 h-8" />
              <label>Menu</label>
            </div>
            <div className="flex flex-col items-center justify-center">
              <PhoneCall className=" w-8 h-8" />
              <label>Call us</label>
            </div>
            <div className="flex flex-col items-center justify-center">
              <MapPinned className=" w-8 h-8" />
              <label>Location</label>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Heart className="w-8 h-8" />
              <label>Favorite</label>
            </div>
          </div>
        </div>
        <div className="max-w-[90%] mx-auto ">
          <div className="border-b border-gray-400 pb-4 pt-4">
            <h1 className="text-2xl mb-2 font-bold text-gray-900 text-center">
              {restaurant.name}
            </h1>
            {restaurant.cuisines && restaurant.cuisines.length > 0 && (
              <ul className="flex flex-wrap gap-2 justify-center">
                {restaurant.cuisines.map((cuisine, index) => (
                  <li
                    key={index}
                    className={` list-disc list-inside text-gray-500   ${
                      index === 0 ? "list-none" : ""
                    }`}
                  >
                    {capitalizeWords(cuisine)}
                  </li>
                ))}
                <span className="text-gray-500 ">$</span>
              </ul>
            )}
          </div>
          <div className="border-b border-gray-400 pb-4 pt-4">
            {restaurant.open && restaurant.close && (
              <div className="flex ">
                <Clock className="w-5 h-5 inline-block mr-2 text-gray-600" />
                <p className="text-sm text-gray-600">
                  <span>Hours: </span>
                  {restaurant.open} - {restaurant.close}
                </p>
              </div>
            )}
            <div className="flex items-center justify center gap-2 text-sm text-gray-600 my-2">
              <MapPin className="w-5 h-5 inline-block text-gray-600" />
              <p className="text-gray-700">
                {restaurant.address1 && <span>{restaurant.address1}</span>}
                {restaurant.suburb && (
                  <span className="ml-2">
                    {capitalizeWords(restaurant.suburb)}
                  </span>
                )}
              </p>
              <div className="w-1 h-1 rounded-full bg-gray-600 flex items-center" />
              <p>1.0km Away</p>
            </div>
          </div>

          {restaurant.deals && restaurant.deals.length > 0 && (
            <ol>
              {[...restaurant.deals]
                .sort((a, b) => {
                  const discountA = Number(a.discount) || 0;
                  const discountB = Number(b.discount) || 0;
                  return discountB - discountA;
                })
                .map((deal, index) => (
                  <li
                    key={deal.objectId || index}
                    className="border-b border-gray-400 pb-4 pt-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="  text-xl font-bold">
                        {deal.lightning === "true" && (
                          <span className="text-2xl">⚡</span>
                        )}
                        <span className="text-[#CD4637]">
                          {deal.discount}% Off
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        {(deal.open || deal.start) &&
                        (deal.close || deal.end) ? (
                          <span>
                            Between {deal.start || deal.open} -{" "}
                            {deal.end || deal.close}
                          </span>
                        ) : (
                          <>All day</>
                        )}
                      </div>
                      {deal.qtyLeft && (
                        <span className="text-xs text-gray-500">
                          {deal.qtyLeft} Deals Left
                        </span>
                      )}
                    </div>
                    <div>
                      <button className="px-4 p-1 outline-2 rounded-2xl text-red-700 font-bold hover:bg-red-100 border border-red-700 hover:border-red-900 transition cursor-pointer">
                        Redeem
                      </button>
                    </div>
                  </li>
                ))}
            </ol>
          )}
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
    </Container>
  );
}
