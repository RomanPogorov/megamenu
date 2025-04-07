import { useEffect } from "react";
import { useParams } from "wouter";
import ResourcesTable from "../components/ResourcesTable";
import { useMenu } from "../hooks/useMenu";

const ResourceTypeView = () => {
  const params = useParams<{ id?: string }>();
  const { trackRecentItem, allMenuItems } = useMenu();

  // If navigated to a specific resource, track it in recents
  useEffect(() => {
    if (params.id) {
      const item = allMenuItems.find((item) => item.id === params.id);
      if (item) {
        const recentItem = {
          id: item.id,
          name: item.name,
          category: item.category,
          icon: item.icon,
        };
        trackRecentItem(recentItem);
      }
    }
  }, [params.id]);

  return <ResourcesTable />;
};

export default ResourceTypeView;
