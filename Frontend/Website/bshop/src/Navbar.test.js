import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import CustomNavbar from './Navbar';
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

test("navbar profile for unsigned users", async () => {
  const fakeUser = {
    user_name: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => fakeUser
    })
  );
  var theme = "l0";
  const setMode = (c) => theme = c + theme[1];
  var page;
  await act(async () => {
    page = await render(<CustomNavbar setMode={setMode} theme={theme} />);
  });
  expect(page.queryByTestId("no-profile")).not.toBeNull();
  expect(page.queryByTestId("no-profile")).toHaveTextContent("ورود / ثبتنام");
  expect(page.queryByTestId("nav-prof-img")).toBeNull();
});

test("navbar profile for signed users with no fullname", async () => {
  localStorage.setItem("token", "itsme")
  var fakeUser = {
    user_name: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => fakeUser
    })
  );
  var theme = "l0";
  const setMode = (c) => theme = c + theme[1];
  var page;
  await act(async () => {
    page = await render(<CustomNavbar setMode={setMode} theme={theme} />);
  });
  expect(page.queryByTestId("no-profile")).toBeNull();
  expect(page.queryByTestId("nav-prof-img")).not.toBeNull();
  expect(page.queryByTestId("nav-prof-img")).toHaveAttribute("src", "./../profile.png");
  expect(page.queryByTestId("nav-dropdown")).not.toBeVisible();

  await act(async () => {
    await page.queryByTestId("nav-prof-img").click();
  })
  expect(page.queryByTestId("nav-dropdown")).toBeVisible();
  expect(page.queryByTestId("dropdown-img")).not.toBeNull();
  expect(page.queryByTestId("dropdown-img")).toHaveAttribute("src", "./../profile.png");
  expect(page.queryByTestId("dropdown-fullname")).toHaveTextContent("بدون نام");
  expect(page.queryByTestId("dropdown-username")).toHaveTextContent("uwu");
});

test("navbar profile for signed users with fullname", async () => {
  localStorage.setItem("token", "itsme");
  var theme = "l0";
  const setMode = (c) => theme = c + theme[1];
  var fakeUser = {
    user_name: "uwu",
    FirstName: "اسم",
    LastName: "فامیلی",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => fakeUser
    })
  );
  var page2;
  await act(async () => {
    page2 = await render(<CustomNavbar setMode={setMode} theme={theme} />);
  });
  expect(page2.queryByTestId("no-profile")).toBeNull();
  expect(page2.queryByTestId("nav-prof-img")).not.toBeNull();
  expect(page2.queryByTestId("nav-prof-img")).toHaveAttribute("src", "./../profile.png");
  expect(page2.queryByTestId("nav-dropdown")).not.toBeVisible();

  await act(async () => {
    await page2.queryByTestId("nav-prof-img").click();
  })
  expect(page2.queryByTestId("nav-dropdown")).toBeVisible();
  expect(page2.queryByTestId("dropdown-img")).not.toBeNull();
  expect(page2.queryByTestId("dropdown-img")).toHaveAttribute("src", "./../profile.png");
  expect(page2.queryByTestId("dropdown-fullname")).toHaveTextContent("اسم فامیل");
  expect(page2.queryByTestId("dropdown-username")).toHaveTextContent("uwu");
});

test("navbar profile for signed users with first name (no last name)", async () => {
  localStorage.setItem("token", "itsme")
  var fakeUser = {
    user_name: "uwu",
    FirstName: "اسممم",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => fakeUser
    })
  );
  var theme = "l0";
  const setMode = (c) => theme = c + theme[1];
  var page;
  await act(async () => {
    page = await render(<CustomNavbar setMode={setMode} theme={theme} />);
  });
  expect(page.queryByTestId("no-profile")).toBeNull();
  expect(page.queryByTestId("nav-prof-img")).not.toBeNull();
  expect(page.queryByTestId("nav-prof-img")).toHaveAttribute("src", "./../profile.png");
  expect(page.queryByTestId("nav-dropdown")).not.toBeVisible();

  await act(async () => {
    await page.queryByTestId("nav-prof-img").click();
  })
  expect(page.queryByTestId("nav-dropdown")).toBeVisible();
  expect(page.queryByTestId("dropdown-img")).not.toBeNull();
  expect(page.queryByTestId("dropdown-img")).toHaveAttribute("src", "./../profile.png");
  expect(page.queryByTestId("dropdown-fullname")).toHaveTextContent("اسممم ");
  expect(page.queryByTestId("dropdown-username")).toHaveTextContent("uwu");
});

test("navbar profile for signed users with last name (no first name)", async () => {
  localStorage.setItem("token", "itsme")
  var fakeUser = {
    user_name: "uwu",
    LastName: "فامیلیمم",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => fakeUser
    })
  );
  var theme = "l0";
  const setMode = (c) => theme = c + theme[1];
  var page;
  await act(async () => {
    page = await render(<CustomNavbar setMode={setMode} theme={theme} />);
  });
  expect(page.queryByTestId("no-profile")).toBeNull();
  expect(page.queryByTestId("nav-prof-img")).not.toBeNull();
  expect(page.queryByTestId("nav-prof-img")).toHaveAttribute("src", "./../profile.png");
  expect(page.queryByTestId("nav-dropdown")).not.toBeVisible();

  await act(async () => {
    await page.queryByTestId("nav-prof-img").click();
  })
  expect(page.queryByTestId("nav-dropdown")).toBeVisible();
  expect(page.queryByTestId("dropdown-img")).not.toBeNull();
  expect(page.queryByTestId("dropdown-img")).toHaveAttribute("src", "./../profile.png");
  expect(page.queryByTestId("dropdown-fullname")).toHaveTextContent(" فامیلیمم");
  expect(page.queryByTestId("dropdown-username")).toHaveTextContent("uwu");
});

test("navbar light/dark toggle", async () => {
  localStorage.setItem("token", "itsme")
  var fakeUser = {
    username: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );
  var theme = "l0";
  const setMode = (c) => theme = c + theme[1];
  var page;
  await act(async () => {
    page = await render(<CustomNavbar setMode={setMode} theme={theme} />);
  });
  expect(page.queryByTestId("nav-theme-toggle")).toHaveTextContent("☀");

  await act(async () => {
    await page.queryByTestId("nav-theme-toggle").click();
    page.rerender(<CustomNavbar setMode={setMode} theme={theme} />);
  })
  expect(theme).toBe("d0");
  expect(page.queryByTestId("nav-theme-toggle")).toHaveTextContent("🌙");

  await act(async () => {
    await page.queryByTestId("nav-theme-toggle").click();
    page.rerender(<CustomNavbar setMode={setMode} theme={theme} />);
  })
  expect(theme).toBe("l0");
  expect(page.queryByTestId("nav-theme-toggle")).toHaveTextContent("☀");

  await act(async () => {
    await page.queryByTestId("nav-theme-toggle").click();
    page.rerender(<CustomNavbar setMode={setMode} theme={theme} />);
    await page.queryByTestId("nav-theme-toggle").click();
    page.rerender(<CustomNavbar setMode={setMode} theme={theme} />);
  })
  expect(theme).toBe("l0");
  expect(page.queryByTestId("nav-theme-toggle")).toHaveTextContent("☀");

});