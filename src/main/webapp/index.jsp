<%-- //[START all]--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>

<%@ page import="java.util.List" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<html>
	<head>
    	<link type="text/css" rel="stylesheet" href="/stylesheets/main.css"/>
    	<meta name="google-signin-client_id" content="929037254631-v0vgejggdio3t9gtolq8c0v89mbpvpsr.apps.googleusercontent.com">
    	<meta name="google-signin-scope" content="profile email">
    	<script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
    	<script src="https://apis.google.com/js/platform.js" async defer></script>
    	<script src="/js/app.js"></script>
    	
    	
	</head>

	<body>

		<div id="g-signin" data-theme="dark" data-width="250" data-height="50" data-longtitle="true"></div>
		
		<a id="g-signout" href="#" onclick="signOut();">Sign out</a>
		
	</body>
</html>
