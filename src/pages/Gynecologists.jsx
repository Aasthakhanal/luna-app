import React, {useState, useEffect} from "react";
import { useGetGynecologistsQuery } from "@/app/gynecologistsApi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation } from "lucide-react";

const GynecologistsPage = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  const { data, error, isLoading } = useGetGynecologistsQuery({
    limit: 10,
    page: 1,
    latitude: location?.latitude,
    longitude: location?.longitude,
  });
  console.log(location, "latitude");

  if (isLoading)
    return <p className="text-center py-10">Loading nearby gynecologists...</p>;

  if (error || !data?.data?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No gynecologists found near you.
        </p>
      </div>
    );
  }

  const gynecologists = data.data;
  console.log(gynecologists, "gynecologists");

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <MapPin className="text-primary" size={20} />
            Nearby Gynecologists
          </CardTitle>
          <CardDescription>
            Specialists near you who can help with your cycle irregularities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gynecologists.map((g) => (
              <div
                key={g.id}
                className="border rounded-xl p-4 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{g.name}</h3>
                    <p className="text-primary font-medium">{g.specialty}</p>
                  </div>
                  {g.distance && (
                    <Badge variant="outline">
                      {parseFloat(g.distance).toFixed(1)} km away
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground mb-3">{g.address}</p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${g.latitude},${g.longitude}`,
                        "_blank"
                      )
                    }
                  >
                    <Navigation size={14} />
                    Get Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GynecologistsPage;
