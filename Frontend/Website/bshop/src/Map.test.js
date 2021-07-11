import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import MapPage from './MapPage';
import '@testing-library/jest-dom';
import ServerURL from './Constants';
import EditShopLocation from "./EditShopLocation";
const fetchMock = require('fetch-mock-jest');
import {mount} from 'enzyme';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

// Enzyme.configure({ adapter: new Adapter() });
// import MyComponent from './MyComponent';

// const anotherMock = jest.fn();
// const EditShopLocationMock = (props) => {
// //   React.useEffect(() => {
// //     console.log('using an effect');
// //   });
// //   return (<div>Hello World</div>);
//     props.setPoint = anotherMock;
// };
// jest.mock('./MyComponent', () => ({
//   __esModule: true,
//   namedExport: jest.fn(),
//   default: jest.fn()
// }));
jest.mock('./EditMapLocation', () => (props) => <div {...props} />);


// beforeAll(() => {
//   MyComponent.mockImplementation(EditShopLocationMock);
// });
// import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
// const {defaults} = require('jest-config');
// module.exports = {
//   // ...
//   transform: {
//     "^.+\\.worker.[t|j]sx?$": "workerloader-jest-transformer"
//   }
//   // ...
// };
// import * as Snackbar from 'notistack';

// const enqueueSnackbarMock = jest.fn()
// const closeSnackbarMock = jest.fn()
let container = null;

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    global.window = Object.create(window);
    //mocking snackbar
    // jest.spyOn(Snackbar, 'useSnackbar').mockImplementation(() => ({enqueueSnackbar:enqueueSnackbarMock, closeSnackbar:closeSnackbarMock}))
    global.URL.createObjectURL = jest.fn();
    global.alert = jest.fn();
    Object.defineProperty(window, 'location', {
        value: {
            href: "/map/",
            pathname: "/map/"
        }
    });
    // jest.mock(mapboxgl, () => () => <div />)
    // jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
    //     Map: () => ({getRTLTextPluginStatus:()=>{}})
    //  })); //kaar mikone

    jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
        GeolocateControl: jest.fn(),
        Map: jest.fn(() => ({
            addControl: jest.fn(),
            on: jest.fn(),
            remove: jest.fn(),
            flyTo: jest.fn(),
            on: jest.fn()
        })),
        NavigationControl: jest.fn(),
        getRTLTextPluginStatus: jest.fn(),
        setRTLTextPlugin: jest.fn(),
        supported: jest.fn(),
    }));

    // jest.mock("./worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker",()=>{})
});

afterEach(() => {
    // cleanup on exiting
    fetchMock.mockReset();
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

// test("map for unsigned users", async () => {
//     const shops = [
//         { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", mantaghe: "dkjfsdfj", region: "12", latitude: "53.90", longitude: 90.3 },
//         { title: "فروشگاه جدییییییییید", rate_value: 4.5, rate_count: 1, id: 2, mantaghe: null, address: "ناکجا آباااا029380182د", logo: "sth.png", region: "12", latitude: "53.90932840", longitude: "0.3" },
//         { title: "shop1 @$21* سیب", rate_value: 0, rate_count: 0, id: 3, mantaghe: "9384920*@&$@#$", address: "یه place ای که نمیدانم 34 کجاست", logo: "عکس.jpg", region: "4", latitude: "4", longitude: "90.3" },
//         { title: "234289058", rate_value: 5, rate_count: 20, id: 4, mantaghe: "2", address: "somewhere", logo: "", region: "12", latitude: "53.90099090099009", longitude: "9" },
//         { title: "a very nice* shopp", rate_value: 4.009, rate_count: 200, mantaghe: 12, id: 5, address: "nowhere", logo: "", region: "4", latitude: "5", longitude: "3.0" },
//         { title: "فروشforoush", rate_value: "2", rate_count: 3, id: 6, mantaghe: "8", address: "نبش خیابان sth و 394*", logo: "", region: "6", latitude: "53.90" },
//     ]
//     fetchMock
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/top/", shops)
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", [])
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/2/commentsreplis", [])
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/3/commentsreplis", [])
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/4/commentsreplis", [])
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/5/commentsreplis", [])
//     var page;
//     await act(async () => {
//         page = await render(<MapPage />);
//         await new Promise(resolve => setImmediate(resolve));
//     });
//     expect(page.queryByTestId("all-shops-list")).not.toBeNull();
//     await act(async () => {
//         shops.filter(x => !!x.latitude && !!x.longitude).forEach(async (shop) => {
//             let i = shop.id;
//             if (!!shop.mantaghe)
//                 expect(page.queryByTestId('shop-mantaghe-' + i)).toHaveTextContent(shop.mantaghe + " منطقه");
//             expect(page.queryByTestId("shop-title-" + i)).toHaveTextContent(shop.title);
//             expect(page.queryByTestId("shop-rate-count-" + i)).toHaveTextContent(`(${shop.rate_count})`);
//         });
//         let shop = shops[0];
//         await page.getByTestId("fly-to-shop-" + 1).click();
//         await new Promise(resolve => setImmediate(resolve));

//         expect(page.queryByTestId("all-shops-list")).toBeNull();
//         expect(page.queryByTestId("one-shop")).not.toBeNull();
//         if (!!shop.address)
//             expect(page.queryByTestId('shop-address')).toHaveTextContent(shop.address);
//         if (!!shop.shop_phone)
//             expect(page.queryByTestId('shop-phone')).toHaveTextContent(shop.shop_phone);
//         expect(page.queryByTestId("shop-title")).toHaveTextContent(shop.title);
//         page.debug()
//         if (!!shop.online)
//             expect(page.queryByTestId("shop-online")).toHaveTextContent(`امکان خرید آنلاین دارد`);
//         else
//             expect(page.queryByTestId("shop-not-online")).toHaveTextContent(`امکان خرید آنلاین ندارد`);
//         expect(page.queryByTestId("shop-logo")).toHaveAttribute("src", shop.logo ? shop.logo : "/shop-default-logo.png");
//         console.log(shop)
//         await page.getByTestId("go-back-btn").click();

//     });


// });


// test("map for signed users", async () => {
//     // localStorage.setItem("token", "lslkjfklsjdfk");
//     jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
//         GeolocateControl: jest.fn(),
//         Map: jest.fn(() => ({
//             addControl: jest.fn(),
//             on: jest.fn(),
//             remove: jest.fn(),
//             flyTo: jest.fn()
//         })),
//         NavigationControl: jest.fn(),
//         getRTLTextPluginStatus: jest.fn(),
//         setRTLTextPlugin: jest.fn(),
//         supported: jest.fn(),
//     }));
//     const shops = [
//         { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", mantaghe: "dkjfsdfj", region: "12", latitude: "53.90", longitude: 90.3 },
//         { title: "فروشگاه جدییییییییید", rate_value: 4.5, rate_count: 1, id: 2, mantaghe: null, address: "ناکجا آباااا029380182د", logo: "sth.png", region: "12", latitude: "53.90932840", longitude: "0.3" },
//         { title: "shop1 @$21* سیب", rate_value: 0, rate_count: 0, id: 3, mantaghe: "9384920*@&$@#$", address: "یه place ای که نمیدانم 34 کجاست", logo: "عکس.jpg", region: "4", latitude: "4", longitude: "90.3" },
//         { title: "234289058", rate_value: 5, rate_count: 20, id: 4, mantaghe: "2", address: "somewhere", logo: "", region: "12", latitude: "53.90099090099009", longitude: "9" },
//         { title: "a very nice* shopp", rate_value: 4.009, rate_count: 200, mantaghe: 12, id: 5, address: "nowhere", logo: "", region: "4", latitude: "5", longitude: "3.0" },
//         { title: "فروشforoush", rate_value: "2", rate_count: 3, id: 6, mantaghe: "8", address: "نبش خیابان sth و 394*", logo: "", region: "6", latitude: "53.90" },
//     ]
//     fetchMock
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/top/", shops)
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", [])
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/2/commentsreplis", [])
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/3/commentsreplis", [])
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/4/commentsreplis", [])
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/5/commentsreplis", [])
//     var page;
//     await act(async () => {
//         page = await render(<MapPage />);
//         await new Promise(resolve => setImmediate(resolve));
//     });
//     expect(page.queryByTestId("all-shops-list")).not.toBeNull();
//     await act(async () => {
//         shops.filter(x => !!x.latitude && !!x.longitude).forEach(async (shop) => {
//             let i = shop.id;
//             if (!!shop.mantaghe)
//                 expect(page.queryByTestId('shop-mantaghe-' + i)).toHaveTextContent(shop.mantaghe + " منطقه");
//             expect(page.queryByTestId("shop-title-" + i)).toHaveTextContent(shop.title);
//             expect(page.queryByTestId("shop-rate-count-" + i)).toHaveTextContent(`(${shop.rate_count})`);

//         });
//         let shop = shops[0];
//         await page.getByTestId("fly-to-shop-" + 1).click();
//         await new Promise(resolve => setImmediate(resolve));

//         expect(page.queryByTestId("all-shops-list")).toBeNull();
//         expect(page.queryByTestId("one-shop")).not.toBeNull();
//         if (!!shop.address)
//             expect(page.queryByTestId('shop-address')).toHaveTextContent(shop.address);
//         if (!!shop.shop_phone)
//             expect(page.queryByTestId('shop-phone')).toHaveTextContent(shop.shop_phone);
//         expect(page.queryByTestId("shop-title")).toHaveTextContent(shop.title);
//         page.debug()
//         if (!!shop.online)
//             expect(page.queryByTestId("shop-online")).toHaveTextContent(`امکان خرید آنلاین دارد`);
//         else
//             expect(page.queryByTestId("shop-not-online")).toHaveTextContent(`امکان خرید آنلاین ندارد`);
//         expect(page.queryByTestId("shop-logo")).toHaveAttribute("src", shop.logo ? shop.logo : "/shop-default-logo.png");
//         console.log(shop)
//         await page.getByTestId("go-back-btn").click();
//     });


// });


test("Edit shop's map", async () => {
        localStorage.setItem("token", "lslkjfklsjdfk");
        localStorage.setItem("id", 13);
        // const shops = [
        //     { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", mantaghe: "dkjfsdfj", region: "12", latitude: "53.90", longitude: 90.3 },
        //     { title: "فروشگاه جدییییییییید", rate_value: 4.5, rate_count: 1, id: 2, mantaghe: null, address: "ناکجا آباااا029380182د", logo: "sth.png", region: "12", latitude: "53.90932840", longitude: "0.3" },
        //     { title: "shop1 @$21* سیب", rate_value: 0, rate_count: 0, id: 3, mantaghe: "9384920*@&$@#$", address: "یه place ای که نمیدانم 34 کجاست", logo: "عکس.jpg", region: "4", latitude: "4", longitude: "90.3" },
        //     { title: "234289058", rate_value: 5, rate_count: 20, id: 4, mantaghe: "2", address: "somewhere", logo: "", region: "12", latitude: "53.90099090099009", longitude: "9" },
        //     { title: "a very nice* shopp", rate_value: 4.009, rate_count: 200, mantaghe: 12, id: 5, address: "nowhere", logo: "", region: "4", latitude: "5", longitude: "3.0" },
        //     { title: "فروشforoush", rate_value: "2", rate_count: 3, id: 6, mantaghe: "8", address: "نبش خیابان sth و 394*", logo: "", region: "6", latitude: "53.90" },
        // ]
        fetchMock
            .put("http://eunoia-bshop.ir:8000/api/v1/shops/map/1",200)
            .put("http://eunoia-bshop.ir:8000/users/profile/map/13",200)
        var page;
        await act(async () => {
            window.location.href = jest.fn();
            let wrapper = mount(<EditShopLocation mockSubmit={null} type="s" userState="m" shopID="1"/>);
            await wrapper.update();
            wrapper.setProps({ mockSubmit: [1,2], type:"s", userState:"m" });
            await wrapper.update();
            await new Promise(resolve => setImmediate(resolve));
            // expect(window.location.href).toBe(`/maps/shop?id=1`);
        });

        // expect(page.queryByTestId("all-shops-list")).not.toBeNull();
        // await act(async () => {
        //     shops.filter(x => !!x.latitude && !!x.longitude).forEach(async (shop) => {
        //         let i = shop.id;
        //         if (!!shop.mantaghe)
        //             expect(page.queryByTestId('shop-mantaghe-' + i)).toHaveTextContent(shop.mantaghe + " منطقه");
        //         expect(page.queryByTestId("shop-title-" + i)).toHaveTextContent(shop.title);
        //         expect(page.queryByTestId("shop-rate-count-" + i)).toHaveTextContent(`(${shop.rate_count})`);
    
        //     });
        //     let shop = shops[0];
        //     await page.getByTestId("fly-to-shop-" + 1).click();
        //     await new Promise(resolve => setImmediate(resolve));
    
        //     expect(page.queryByTestId("all-shops-list")).toBeNull();
        //     expect(page.queryByTestId("one-shop")).not.toBeNull();
        //     if (!!shop.address)
        //         expect(page.queryByTestId('shop-address')).toHaveTextContent(shop.address);
        //     if (!!shop.shop_phone)
        //         expect(page.queryByTestId('shop-phone')).toHaveTextContent(shop.shop_phone);
        //     expect(page.queryByTestId("shop-title")).toHaveTextContent(shop.title);
        //     page.debug()
        //     if (!!shop.online)
        //         expect(page.queryByTestId("shop-online")).toHaveTextContent(`امکان خرید آنلاین دارد`);
        //     else
        //         expect(page.queryByTestId("shop-not-online")).toHaveTextContent(`امکان خرید آنلاین ندارد`);
        //     expect(page.queryByTestId("shop-logo")).toHaveAttribute("src", shop.logo ? shop.logo : "/shop-default-logo.png");
        //     console.log(shop)
        //     await page.getByTestId("go-back-btn").click();
        // });
    
    
    });
    
    
    