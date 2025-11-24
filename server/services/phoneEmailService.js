import axios from "axios";

/**
 * Phone.Email API Service
 * Handles OTP generation for email and phone verification
 * API Documentation: https://www.phone.email/
 */

class PhoneEmailService {
  constructor() {
    this.clientId = process.env.PHONE_EMAIL_CLIENT_ID || "17227599749728778174";
    this.baseUrl = "https://www.phone.email";
    this.apiUrl = "https://api.phone.email";
  }

  /**
   * Send OTP to email address using Phone.Email API
   * @param {string} email - Email address to send OTP to
   * @returns {Promise<Object>} Response with session info
   */
  async sendEmailOTP(email) {
    try {
      // Phone.Email uses their widget/SDK for OTP generation
      // The actual OTP sending is handled by their frontend SDK
      // Backend receives the verification token after user enters OTP
      
      return {
        success: true,
        message: "OTP will be sent via Phone.Email widget",
        email: email,
        clientId: this.clientId
      };
    } catch (error) {
      console.error("Error initiating email OTP:", error.message);
      throw new Error("Failed to initiate OTP process");
    }
  }

  /**
   * Verify email OTP using Phone.Email verification token
   * @param {string} userJsonUrl - The verification URL from Phone.Email
   * @returns {Promise<Object>} Verified email information
   */
  async verifyEmailOTP(userJsonUrl) {
    try {
      if (!userJsonUrl || !userJsonUrl.startsWith('http')) {
        throw new Error("Invalid user_json_url provided");
      }

      console.log("Fetching user data from:", userJsonUrl);
      
      const response = await axios.get(userJsonUrl, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Inner-Compass-Server/1.0'
        }
      });

      const data = response.data;
      console.log("Received user data:", data);
      
      // Extract email - Phone.Email uses 'user_email' field
      const email = data.user_email || data.email || data.user_email_id;
      
      if (!email) {
        console.error("No email found in response:", data);
        throw new Error("Email not found in verification response");
      }
      
      return {
        email: email,
        phoneNumber: data.user_phone_number || data.phone_number || null,
        countryCode: data.user_country_code || data.country_code || null,
        firstName: data.user_first_name || data.first_name || "",
        lastName: data.user_last_name || data.last_name || "",
        verified: true,
        verifiedAt: new Date()
      };
    } catch (error) {
      console.error("Error verifying email OTP:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw new Error("Failed to verify email: " + error.message);
    }
  }

  /**
   * Get client ID for frontend integration
   * @returns {string} Phone.Email client ID
   */
  getClientId() {
    return this.clientId;
  }
}

export default new PhoneEmailService();
