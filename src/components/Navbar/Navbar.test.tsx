import "@testing-library/jest-dom";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";

import { render, screen } from "../../utils/test-utils";
import Navbar from "./Navbar";

const mockAuthenticatedSession: Session = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: {
    id: "123",
    email: "hello@example.com",
    image:
      "https://lh3.googleusercontent.com/a-/ACNPEu9XMJU7P1gFZejccsoCGVijG4rPKBuu1zWxO5KJuQ=s96-c",
    name: "ian",
  },
};

jest.mock("next-auth/react");

describe("Navbar", () => {
  it("renders correctly", () => {
    render(<Navbar />);
  });

  it("displays user profile button when signed in", () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: mockAuthenticatedSession,
      status: "authenticated",
    });
    render(<Navbar />);
    const userMenuBtn = screen.getByTestId("user-menu-button");

    expect(userMenuBtn).toBeInTheDocument();
  });

  it("displays login text when signed out", () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: {},
      status: "unauthenticated",
    });
    render(<Navbar />);
    const loginText = screen.getByText("Login");

    expect(loginText).toBeInTheDocument();
  });
});
