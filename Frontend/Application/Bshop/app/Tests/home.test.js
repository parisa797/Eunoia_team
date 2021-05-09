import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
} from "react-native-testing-library";
import renderer from "react-test-renderer";
// import { shallow } from "enzyme";

import Home from "../homepage";

describe("Home page with shops be tested", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // it("fetch test", async () => {
  //   const shops = [
  //     {
  //       title: "shop1",
  //       rate_value: 0,
  //       rate_count: 10,
  //       id: 0,
  //       address: "ادرس ادرس آدرسسسسس",
  //       logo: "sljfleij.png",
  //     },
  //     {
  //       title: "shop2-سینمتبمث",
  //       rate_value: 1.23482394,
  //       id: 1,
  //       address: "",
  //       logo: "",
  //     },
  //     {
  //       title: "شاپ3",
  //       rate_value: 2.3,
  //       rate_count: 11,
  //       id: 2,
  //       address: "a",
  //       logo: null,
  //     },
  //     {
  //       title: "",
  //       rate_value: 5,
  //       id: 3,
  //       address: "addressssss sdfe",
  //       logo: "",
  //     },
  //   ];
  //   jest.spyOn(global, "fetch").mockImplementation(() =>
  //     Promise.resolve({
  //       status: 200,
  //       json: () => shops,
  //     })
  //   );

  //   const push = jest.fn();
  //   const { getByTestId, getByPlaceholderText } = await render(
  //     <Home navigation={{ push }} />
  //   );
  //   await new Promise((resolve) => setImmediate(resolve));
  // });

  //   it("fetches data from server when server returns a successful response", (done) => {
  //     // 1
  //     const mockSuccessResponse = {};
  //     const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
  //     const mockFetchPromise = Promise.resolve({
  //       // 3
  //       json: () => mockJsonPromise,
  //     });
  //     // jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise); // 4
  //     global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

  //     const wrapper = shallow(<Home />); // 5

  //     expect(global.fetch).toHaveBeenCalledTimes(1);
  //     expect(global.fetch).toHaveBeenCalledWith(
  //       "http://iust-bshop.herokuapp.com/api/v1/shops/"
  //     );

  //     process.nextTick(() => {
  //       // 6
  //       //   expect(wrapper.state()).toEqual({
  //       //     // ... assert the set state
  //       //   });

  //       global.fetch.mockClear(); // 7
  //       done(); // 8
  //     });
  //   });

  //   it("fetch test", async () => {
  //     const push = jest.fn();
  //     const { getByTestId, getByPlaceholderText } = await render(
  //       <Home navigation={{ push }} />
  //     );

  //     const shop = [
  //       {
  //         title: "فروشگاه",
  //         phone: "09900000000",
  //         id: 1,
  //       },
  //     ];

  //     const mocked = jest.spyOn(global, "fetch").mockImplementation(() =>
  //       Promise.resolve({
  //         status: 200,
  //         json: () => shop,
  //       })
  //     );

  //     expect(mocked).toHaveBeenCalled();
  //   });
});
