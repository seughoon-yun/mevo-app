package nz.co.mevo.app;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;



import static io.intercom.api.CustomAttribute.*;

import io.intercom.api.CustomAttribute;
import io.intercom.api.Intercom;
import io.intercom.api.User;

public class AppServlet extends HttpServlet {
	
	private String intercomAppID = "ou4uas01";
	private String intercomAPIKey = "7d8c4e858543c8a4578dc8a8041465c406c6f88e";
	private String googleClientID = "929037254631-v0vgejggdio3t9gtolq8c0v89mbpvpsr.apps.googleusercontent.com";
	
	@Override
	public void init() {
		// Fire up ze Intercom!
		Intercom.setApiKey(intercomAPIKey);
		Intercom.setAppID(intercomAppID);
	}
	
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		try {
			// Get the Google Auth token
			String token = getPayload(request.getReader());
			
			// Verify the token - throws an exception if it fails
			JSONObject payload = getGoogleAccount(token);
				
			// Get the juicy profile goodness
			String email = (String) payload.get("email");
				
			// Prepare to check the email in Intercom
			Map<String, String> params = new HashMap<String, String>();
			params.put("email", email);
				
			// Check if they exist already
			try {
				User existing = User.find(params);
					
				// User exists
				// Return a 200
				response.setStatus(200);
				response.getWriter().write(convertToJSON(existing).toString());
			} catch (Exception e) {
				// This is our first time seeing this person
				// Get their Google details
				String name = (String) payload.get("name");
				String lastName = (String) payload.get("family_name");
				String firstName = (String) payload.get("given_name");
				String pictureURL = (String) payload.get("picture");
				Boolean emailVerified = Boolean.valueOf((String) payload.get("email_verified"));
					
				// Use this to create a new Intercom user
				User user = new User()
						.setEmail(email)
						.setName(name)
						.addCustomAttribute(newStringAttribute("first_name", firstName))
						.addCustomAttribute(newStringAttribute("middle_name", ""))
						.addCustomAttribute(newStringAttribute("last_name", lastName))
						.addCustomAttribute(newStringAttribute("preferred_name", ""))
						.addCustomAttribute(newStringAttribute("date_of_birth", ""))
						.addCustomAttribute(newStringAttribute("phone_number", ""))
						.addCustomAttribute(newStringAttribute("licence_number", ""))
						.addCustomAttribute(newStringAttribute("licence_version", ""))
						.addCustomAttribute(newStringAttribute("licence_expiry_date", ""))
						.addCustomAttribute(newStringAttribute("address_line1", ""))
						.addCustomAttribute(newStringAttribute("address_line2", ""))
						.addCustomAttribute(newStringAttribute("address_suburb", ""))
						.addCustomAttribute(newStringAttribute("address_city", ""))
						.addCustomAttribute(newStringAttribute("address_postcode", ""))
						.addCustomAttribute(newStringAttribute("address_country", ""))
						.addCustomAttribute(newBooleanAttribute("email_verified", emailVerified))
						.addCustomAttribute(newStringAttribute("picture_url", pictureURL));
					
				// Save them in Intercom
				user = User.create(user);
					
				// Return a 201
				response.setStatus(201);
				response.getWriter().write(convertToJSON(user).toString());
			}
		} catch (GeneralSecurityException e) {
			response.setStatus(400);
			response.getWriter().write("Security Exception: " + e.getMessage());
		} catch (IOException e) {
			response.setStatus(400);
			response.getWriter().write("IOException: " + e.getMessage());
		} catch (Exception e) {
			response.setStatus(400);
			e.printStackTrace(response.getWriter());
		}	
	}

	@Override
	public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		try {
			
			//String token = request.getParameter("payload");
			//String userString = request.getParameter("profile");
			
			//response.setStatus(200);
			//response.getWriter().write(token + " " + userString);
			
			// Get the request body
			JSONObject body = new JSONObject(getPayload(request.getReader()));
			
			String token = (String) body.get("token");
			
			if (verifyGoogleToken(token)) {
				// Token is good to go
				JSONObject updated = (JSONObject) body.get("profile");
				
				User toBeSaved = convertFromJSON(updated);
				toBeSaved = User.create(toBeSaved);
				
				// Return a 200
				response.setStatus(200);
				response.getWriter().write(convertToJSON(toBeSaved).toString());
				
			} else {
				// This isn't a valid token
				response.setStatus(401);
				response.getWriter().write("Google authorization failed. Please log out and log back in again.");
			}
			 
		} catch (IOException e) {
			response.setStatus(400);
			response.getWriter().write("IOException: " + e.getMessage());
		} catch (Exception e) {
			response.setStatus(400);
			e.printStackTrace(response.getWriter());
		}		
	}
	
	private boolean verifyGoogleToken(String token) throws IOException, UnsupportedEncodingException{
		String url = "https://www.googleapis.com/oauth2/v3/tokeninfo";
		String charset = "UTF-8";
		
		String query = String.format("id_token=%s", URLEncoder.encode(token, charset));
		
		HttpURLConnection connection = (HttpURLConnection) new URL(url + "?" + query).openConnection();
		
		int responseCode = connection.getResponseCode();
		
		return (responseCode == HttpsURLConnection.HTTP_OK);
	}
	
	private JSONObject getGoogleAccount(String token) throws GeneralSecurityException, IOException, UnsupportedEncodingException {
		String url = "https://www.googleapis.com/oauth2/v3/tokeninfo";
		String charset = "UTF-8";
		
		String query = String.format("id_token=%s", URLEncoder.encode(token, charset));
		
		HttpURLConnection connection = (HttpURLConnection) new URL(url + "?" + query).openConnection();
		
		int responseCode = connection.getResponseCode();
		
		if (responseCode == HttpsURLConnection.HTTP_OK) {
			InputStream response = connection.getInputStream();
			Reader responseReader = new InputStreamReader(response);
			JSONObject json = new JSONObject(getPayload(responseReader));
			return json;
		} else {
			throw new GeneralSecurityException("Google Authentication Failed");
		}	
	}
	
	private String getPayload(Reader reader) throws IOException {
		String body = null;
	    StringBuilder stringBuilder = new StringBuilder();
	    BufferedReader bufferedReader = null;

	    try {
	    	bufferedReader = new BufferedReader(reader);
	        char[] charBuffer = new char[128];
	        int bytesRead = -1;
	        while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
	            stringBuilder.append(charBuffer, 0, bytesRead);
	        }
	    } catch (IOException ex) {
	        throw ex;
	    } finally {
	        if (bufferedReader != null) {
	            try {
	                bufferedReader.close();
	            } catch (IOException ex) {
	                throw ex;
	            }
	        }
	    }

	    body = stringBuilder.toString();
	    return body;
	}
	
	private JSONObject convertToJSON(User user) {
		Map<String, CustomAttribute> userAttributes = user.getCustomAttributes();
		
		JSONObject json = new JSONObject();
		
		json.put("email", user.getEmail());
		json.put("name", user.getName());
		
		for (String key : userAttributes.keySet()) {
			CustomAttribute ca = userAttributes.get(key);
			if (ca == null) {
				json.put(key, "");
			} else {
				json.put(key, ca.getValue());
			}
		}
		
		return json;
	}
	
	private User convertFromJSON(JSONObject json) {
		User user = new User();
		
		user.setEmail(json.getString("email"));
		user.setName(json.getString("name"));
		
		json.remove("email");
		json.remove("name");
		
		for (String key : json.keySet()) {
			if ("true".equals(json.get(key).toString())) {
				user.addCustomAttribute(newBooleanAttribute(key, true));
			} else if ("false".equals(json.get(key).toString())) {
				user.addCustomAttribute(newBooleanAttribute(key, false));
			} else {
				user.addCustomAttribute(newStringAttribute(key, json.get(key).toString()));
			}
		}
		
		return user;
	}
}
