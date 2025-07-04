
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import storeExports from './store';
import routeExports from './routes';

const { store } = storeExports;
const { router } = routeExports;

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

const appExports = {
  App,
};

export default appExports;
