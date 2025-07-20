import { Switch, Route } from "wouter";
import HomePage from "@/pages/home";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Switch>
        <Route path="/">
          <HomePage />
        </Route>
        <Route>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600">Page not found</p>
              <a href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                Go back home
              </a>
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
