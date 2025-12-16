import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

interface OtpResponse {
  success: boolean;
  error?: string;
}

interface VerifyOtpResponse {
  success: boolean;
  error?: string;
  session?: any;
}

class AuthService {
  loginWithOtp = async (email: string): Promise<OtpResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Failed to send OTP. Please try again.",
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  verifyOtp = async (
    email: string,
    otp: string
  ): Promise<VerifyOtpResponse> => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (error) {
        return {
          success: false,
          error: error.message || "Invalid OTP. Please try again.",
        };
      }

      return {
        success: true,
        session,
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  signInWithGoogle = async (): Promise<VerifyOtpResponse> => {
    try {
      const redirectUrl = Linking.createURL("/auth/v1/callback");
      console.log("Redirect URL:", redirectUrl); // Log for debugging
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No URL returned from Supabase");

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === "success" && result.url) {
        const params = this.parseUrlParams(result.url);

        if (params.error) {
          return {
            success: false,
            error: params.error_description || params.error,
          };
        }

        if (params.access_token && params.refresh_token) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: params.access_token,
              refresh_token: params.refresh_token,
            });
          if (sessionError) throw sessionError;
          return { success: true, session: sessionData.session };
        }

        if (params.code) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.exchangeCodeForSession(params.code);
          if (sessionError) throw sessionError;
          return { success: true, session: sessionData.session };
        }
      }

      return { success: false, error: "Sign in cancelled" };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "An error occurred during Google Sign In",
      };
    }
  };

  signInWithFacebook = async (): Promise<VerifyOtpResponse> => {
    try {
      const redirectUrl = Linking.createURL("/auth/v1/callback");
      console.log("Redirect URL:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No URL returned from Supabase");

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === "success" && result.url) {
        const params = this.parseUrlParams(result.url);

        if (params.error) {
          return {
            success: false,
            error: params.error_description || params.error,
          };
        }

        if (params.access_token && params.refresh_token) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: params.access_token,
              refresh_token: params.refresh_token,
            });
          if (sessionError) throw sessionError;
          return { success: true, session: sessionData.session };
        }

        if (params.code) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.exchangeCodeForSession(params.code);
          if (sessionError) throw sessionError;
          return { success: true, session: sessionData.session };
        }
      }

      return { success: false, error: "Sign in cancelled" };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "An error occurred during Facebook Sign In",
      };
    }
  };

  private parseUrlParams(url: string): Record<string, string> {
    const params: Record<string, string> = {};

    const queryString = url.split("?")[1];
    if (queryString) {
      queryString.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        if (key && value) params[key] = decodeURIComponent(value);
      });
    }

    const hashString = url.split("#")[1];
    if (hashString) {
      hashString.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        if (key && value) params[key] = decodeURIComponent(value);
      });
    }

    return params;
  }
}

export default new AuthService();
