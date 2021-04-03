import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import RegisterStore from './registerStore';
import '@testing-library/jest-dom';


let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("register for store", async () => {

  const RegisterStore = [{storeName: "janbo",src: "",ownerName: "asghar",address: "asghar abade shomali",code: "021357895",phone: "091211125411" }
    , { storeName: "janbo2",src: "",ownerName: "asghar2",address: "asghar abade shomali2",code: "02135895",phone: "09121115411" }
    , { storeName: "janbo3",src: "",ownerName: "asghar3",address: "asghar abade shomali3",code: "02137895",phone: "09121125611" }
    , { storeName: "janbo4",src: "",ownerName: "asghar3",address: "asghar abade shomali4",code: "02139895",phone: "09121112411" }
  ];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(RegisterStore)
    })
  );
  var page;
  await act(async () => {
    page = await render(<RegisterStore />);
  });

});

