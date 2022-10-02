import "@testing-library/jest-dom";

import { Session } from "next-auth";

import { render, screen } from "../../utils/test-utils";
import Navbar from "./Navbar";

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  const mockSession: Session = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: {
      id: "123",
      email: "hello@example.com",
      image:
        "https://lh3.googleusercontent.com/a-/ACNPEu9XMJU7P1gFZejccsoCGVijG4rPKBuu1zWxO5KJuQ=s96-c",
      name: "ian",
    },
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

describe("Navbar", () => {
  it("renders correctly", () => {
    render(<Navbar />);
  });

  it("displays user profile button", () => {
    render(<Navbar />);
    const userMenuBtn = screen.getByTestId("user-menu-button");

    expect(userMenuBtn).toBeInTheDocument();
  });
});
