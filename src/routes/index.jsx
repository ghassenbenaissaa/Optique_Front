import { Navigate, Route, Routes } from 'react-router-dom';
import { layoutsRoutes, singlePageRoutes } from './Routes';

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {layoutsRoutes.map((route) => (
          <Route key={route.name} path={route.path} element={route.element} />
        ))}

        {singlePageRoutes.map((route) => (
          <Route key={route.name} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
};
export default AppRoutes;
