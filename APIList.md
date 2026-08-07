# Dev-Tinder APIs

## auth router

- POST /signup
- POST /login
- POST /logout - loggedin user should be allowed to logout // for now placing it in profilerouter as it is only access by loggedin profiles

## profile router

- GET /profile/view
- PATCH /profile/edit - update profile details
- PATCH /profile/password - update password

## request router

<pre>
    (b)
        - only friend connections
    (a)
        - POST /request/send/interested/:userId <pre> // those I right swipe</pre>

        - POST /request/send/ignored/:userId <pre> // those I left swipe</pre>
    (c)
        - POST /request/review/accepted/:requestId <pre> - those I have requested and are accepted + their requestId </pre>
        - POST /request/review/rejected/:requestId <pre> - those I have requested and have rejected + their requestId </pre>

</pre>

## user router

- (b) GET /connections - gets you the profiles that you have already established connection (friends)
- (c) GET requests/received - list of profiles who requested you (friend request)
- (a) GET /feed - Gets you the profiles of other users on the platform (find({}) // fetch all users)

<pre>Status:    - ignored
                        * no action to required
                - interested
                        * accepted
                        * rejected
</pre>
