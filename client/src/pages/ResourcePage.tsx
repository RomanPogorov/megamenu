import React, { useEffect } from "react";
import { useParams } from "wouter";
import { useMenu } from "../hooks/useMenu";

const ResourcePage: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const resourceId = params.id || "";
  const { allMenuItems, categories } = useMenu();

  // Находим информацию о ресурсе
  const resourceItem = allMenuItems.find((item) => item.id === resourceId);

  // Находим категорию
  const categoryId = resourceItem?.category || "";
  const category = categories.find((cat) => cat.id === categoryId);

  const getResourceTitle = () => {
    if (!resourceItem) return resourceId;
    return resourceItem.name;
  };

  const getCategoryName = () => {
    if (!category) return "";
    return category.name;
  };

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="mb-2 text-sm">
        <span className="text-gray-500">
          {getCategoryName() ? `${getCategoryName()} / ` : ""}
        </span>
      </div>

      <h1 className="text-3xl font-bold mb-8">{getResourceTitle()}</h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Детали ресурса</h2>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-500 mb-1">ID ресурса</div>
            <div className="font-medium">{resourceId}</div>
          </div>

          {resourceItem && (
            <>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-500 mb-1">Имя</div>
                <div className="font-medium">{resourceItem.name}</div>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-500 mb-1">Категория</div>
                <div className="font-medium">{getCategoryName()}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;
