import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "./theme/ThemeProvider";
import Router from "./routes/Router";
import { store, persistor } from "./redux/store";
import { initializeAuth } from "./redux/slices/authSlice";
import LoadingPage from "./components/ui/loading-page";

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <LoadingPage
            title="Gotera Youth"
            subtitle="Initializing Member Management System"
          />
        }
        persistor={persistor}
        onBeforeLift={() => {
          // Initialize auth state from localStorage when app starts
          store.dispatch(initializeAuth());
        }}
      >
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              {Router.map((route, index) => (
                <Route key={index} path={route.path} element={route.element}>
                  {route.children?.map((child, childIndex) => (
                    <Route
                      key={childIndex}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              ))}
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
