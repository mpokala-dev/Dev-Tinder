# Dev-Tinder APIs

## auth router

- POST /signup
- POST /login
- POST /logout <!-- logout is just clear the user cookies and ask the user to login irrespective of any details or validation to proceed with -->

## profile router

- GET /profile/view
- PATCH /profile/edit <!-- update profile details -->
- PATCH /profile/password <!-- reset password -->

## request router

<pre>

    (a) // as a sender requests that I can send
        - POST /request/send/interested/:userId <!-- those I right swipe -->

        - POST /request/send/ignored/:userId  <!-- those I left swipe -->

        - /request/send/:status/:userId <!-- status can be interested | ignored -->

    (b) // as a receiver requests that I can receive
        - POST /request/review/accepted/:requestId <!-- - request that I accepted -->

        - POST /request/review/rejected/:requestId <!-- - request that I rejected -->

        - /request/review/:status/:requestId <!-- status can be accepted | rejected --><!-- - requestId is the ID of the request I was requested with the status that I accepted or rejected -->
    
    (c) // only accepted connections <!-- friend connections -->

</pre>

## user router

- GET /connections <!-- gets you the profiles that you have already established connection (friends) -->
- GET /user/requests <!-- list of pending requests (friend request) -->
- GET /feed <!-- Gets you the profiles of other users on the platform (find({}) // fetch all users) -->

<pre>Status:    - ignored <!-- once a request is ignored, the same users cannot request connection again between them -->
                        * no action to required
                - interested
                        * accepted
                        * rejected
</pre>
