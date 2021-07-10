import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from "react-native-testing-library";
import renderer from "react-test-renderer";
import { useIsFocused } from "@react-navigation/native";

import CommentItem from "../commentItem";

jest.mock("@react-navigation/native", () => {
  return {
    useIsFocused: () => true,
  };
});

describe("testing item's comment ", () => {
  it("renders correctly", () => {
    const push = jest.fn();
    const params = 3;
    const tree = renderer.create(
      <CommentItem navigation={{ push }} route={{ params }} />
    );
    expect(tree).toMatchSnapshot();
  });

  it("comment fetch test", async () => {
    const params = 3;

    const fetchMock = require("fetch-mock-jest");
    const comments = [
      {
        user: {
          urls: [
            {
              uploaded_file: "parisa.jpg",
            },
          ],
          user_name: "parisa",
        },
        text: "من از محصول خیلی راضیم!",
        date_jalali: "1400-04-06 19:04:26.637765",
        id: 0,
      },
      {
        user: {
          urls: [
            {
              uploaded_file: "anime.jpg",
            },
          ],
          user_name: "mobasher_sh",
        },
        text: "به بقیه هم پیشنهاد دادم خرید کنن انقد شما خوبید",
        date_jalali: "1400-02-06 06:04:26.637765",
        id: 1,
      },
      {
        user: {
          urls: [],
          user_name: "setarejj",
        },
        text: "من مشتری ثابت شمام",
        date_jalali: "1390-11-06 19:44:03.637765",
        id: 2,
      },
      {
        user: {
          urls: [],
          user_name: "zahra_mah78",
        },
        text: "من از خریدم راضی نبودم والا :(",
        date_jalali: "1399-10-16 04:04:56.637765",
        id: 3,
      },
    ];

    var url = "http://eunoia-bshop.ir:8000/api/v1/shops/comment/list/" + params;
    // console.log("the get url", url);
    fetchMock.get(url, comments);

    const push = jest.fn();
    const { getByTestId, queryByTestId } = await render(
      <CommentItem navigation={{ push }} route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/api/v1/shops/comment/list/3",
      "get"
    );
    // console.log(getByTestId("comments-list").props);
    expect(getByTestId("comments-list").props.data.length).toBe(
      comments.length
    );

    for (var i = 0; i < comments.length; i++) {
      expect(getByTestId("comment-userid-" + i).props.children).toBe(
        comments[i].user.user_name
      );

      //if user has profile image, show his own image
      if (comments[i].user.urls.length != 0) {
        expect(queryByTestId("comment-avatar-" + i).props.source.uri).toBe(
          comments[i].user.urls[0].uploaded_file
        );
        expect(queryByTestId("comment-noavatar-" + i)).toBeNull();
      }
      // else (user doesn't have any photo), show default profile image
      else {
        expect(queryByTestId("comment-noavatar-" + i)).not.toBeNull();
        expect(queryByTestId("comment-avatar-" + i)).toBeNull();
      }

      expect(getByTestId("comment-text-" + i).props.children).toBe(
        comments[i].text
      );

      var date = comments[i].date_jalali.slice(0, 16);
      expect(getByTestId("comment-date-" + i).props.children).toBe(date);
    }

    fetchMock.mockClear();
  });
});
