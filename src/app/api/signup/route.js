

// app/api/signup/route.js
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("✅ Signup data received:", body);

    // Validate required fields
    if (!body.email || !body.phone || !body.firebaseUid) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields: email, phone, or firebaseUid",
        },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Validate the Firebase user exists (optional security check)
    // 2. Save user data to your database
    // 3. Create user profile/account
    // 4. Set up any business logic (user roles, permissions, etc.)

    // For now, returning a mock response
    const userData = {
      id: Date.now(), // Mock user ID
      email: body.email,
      phone: body.phone,
      country: body.selectedCountry,
      countryCode: body.countryCode,
      firebaseUid: body.firebaseUid,
      role: "BUSINESS_USER", // Default role
      createdAt: new Date().toISOString(),
      verified: true, // Since Firebase already verified the phone
    };

    console.log("✅ User account created (mock):", userData);

    return Response.json({
      success: true,
      message: "User account created successfully",
      user: userData,
    });

  } catch (error) {
    console.error("❌ Error in signup API:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Optional: Add a GET method for testing
export async function GET() {
  return Response.json({
    message: "Signup API endpoint is working",
    timestamp: new Date().toISOString(),
  });
}