---
title: Laravel API Documentation v1.0.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="laravel-api-documentation">Laravel API Documentation v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Base URLs:

* <a href="http://localhost">http://localhost</a>

<h1 id="laravel-api-documentation-authentication">Authentication</h1>

## cierraLaSesinDelUsuario

<a id="opIdcierraLaSesinDelUsuario"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/auth/logout \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/auth/logout HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/auth/logout',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/auth/logout',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/auth/logout', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/auth/logout', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/auth/logout");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/auth/logout", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/auth/logout`

*Cierra la sesión del usuario.*

> Example responses

> 200 Response

```json
{
  "status": "success",
  "message": "Usuario deslogeado exitosamente."
}
```

<h3 id="cierralasesindelusuario-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="cierralasesindelusuario-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## registraUnNuevoUsuario

<a id="opIdregistraUnNuevoUsuario"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/auth/register \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://localhost/api/auth/register HTTP/1.1
Host: localhost
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "consequatur",
  "username": "consequatur",
  "email": "qkunze@example.com",
  "password": "O[2UZ5ij-e/dl4m{o,"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost/api/auth/register',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://localhost/api/auth/register',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://localhost/api/auth/register', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/auth/register', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/auth/register");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/auth/register", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/auth/register`

*Registra un nuevo usuario.*

> Body parameter

```json
{
  "name": "consequatur",
  "username": "consequatur",
  "email": "qkunze@example.com",
  "password": "O[2UZ5ij-e/dl4m{o,"
}
```

<h3 id="registraunnuevousuario-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|El nombre del usuario. Ejemplo: John Doe|
|» username|body|string|true|El nombre de usuario. Ejemplo: johndoe|
|» email|body|string|true|El correo electrónico del usuario. Ejemplo: johndoe@example.com|
|» password|body|string|true|La contraseña del usuario. Ejemplo: password123|

> Example responses

> 201 Response

```json
{
  "status": "success",
  "user": {
    "id": 1,
    "name": "John Doe"
  },
  "token": "your-generated-token"
}
```

<h3 id="registraunnuevousuario-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|none|Inline|

<h3 id="registraunnuevousuario-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» user|object|false|none|none|
|»» id|integer|false|none|none|
|»» name|string|false|none|none|
|» token|string|false|none|none|

Status Code **422**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» errors|object|false|none|none|
|»» email|[string]|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## iniciaSesinConElUsuario

<a id="opIdiniciaSesinConElUsuario"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/auth/login \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://localhost/api/auth/login HTTP/1.1
Host: localhost
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "user": "consequatur",
  "password": "O[2UZ5ij-e/dl4m{o,"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost/api/auth/login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://localhost/api/auth/login',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://localhost/api/auth/login', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/auth/login', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/auth/login");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/auth/login", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/auth/login`

*Inicia sesión con el usuario.*

> Body parameter

```json
{
  "user": "consequatur",
  "password": "O[2UZ5ij-e/dl4m{o,"
}
```

<h3 id="iniciasesinconelusuario-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» user|body|string|true|El correo electrónico o nombre de usuario del usuario. Ejemplo: johndoe@example.com|
|» password|body|string|true|La contraseña del usuario. Ejemplo: password123|

> Example responses

> 201 Response

```json
{
  "status": "success",
  "user": {
    "id": 1,
    "name": "John Doe"
  },
  "token": "your-generated-token",
  "message": "Usuario logeado exitosamente."
}
```

<h3 id="iniciasesinconelusuario-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|none|Inline|

<h3 id="iniciasesinconelusuario-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» user|object|false|none|none|
|»» id|integer|false|none|none|
|»» name|string|false|none|none|
|» token|string|false|none|none|
|» message|string|false|none|none|

Status Code **422**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» errors|object|false|none|none|
|»» user|[string]|false|none|none|
|»» password|[string]|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## iniciaSesinConGoogleEsteEndpointPermiteALosUsuariosIniciarSesinUtilizandoSuCuentaDeGoogleSiElUsuarioNoExisteSeCreaUnoNuevo

<a id="opIdiniciaSesinConGoogleEsteEndpointPermiteALosUsuariosIniciarSesinUtilizandoSuCuentaDeGoogleSiElUsuarioNoExisteSeCreaUnoNuevo"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/auth/google/callback \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/auth/google/callback HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/auth/google/callback',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/auth/google/callback',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/auth/google/callback', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/auth/google/callback', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/auth/google/callback");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/auth/google/callback", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/auth/google/callback`

*Inicia sesión con Google.

Este endpoint permite a los usuarios iniciar sesión utilizando su cuenta de Google. Si el usuario no existe, se crea uno nuevo.*

> Example responses

> 200 Response

```json
{
  "status": "success",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "profile_pic": "http://profilepic.com/pic.jpg",
    "username": "johndoe"
  },
  "token": "your-generated-token"
}
```

<h3 id="iniciasesincongoogleesteendpointpermitealosusuariosiniciarsesinutilizandosucuentadegooglesielusuarionoexistesecreaunonuevo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

<h3 id="iniciasesincongoogleesteendpointpermitealosusuariosiniciarsesinutilizandosucuentadegooglesielusuarionoexistesecreaunonuevo-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» user|object|false|none|none|
|»» id|integer|false|none|none|
|»» name|string|false|none|none|
|»» email|string|false|none|none|
|»» profile_pic|string|false|none|none|
|»» username|string|false|none|none|
|» token|string|false|none|none|

Status Code **422**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## redirigeAlUsuarioALaPantallaDeLoginDeGoogleEsteEndpointRedirigeAlUsuarioALaPantallaDeLoginDeGoogleParaLaAutenticacin

<a id="opIdredirigeAlUsuarioALaPantallaDeLoginDeGoogleEsteEndpointRedirigeAlUsuarioALaPantallaDeLoginDeGoogleParaLaAutenticacin"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/auth/google/redirect \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/auth/google/redirect HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/auth/google/redirect',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/auth/google/redirect',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/auth/google/redirect', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/auth/google/redirect', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/auth/google/redirect");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/auth/google/redirect", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/auth/google/redirect`

*Redirige al usuario a la pantalla de login de Google.

Este endpoint redirige al usuario a la pantalla de login de Google para la autenticación.*

> Example responses

> 302 Response

```json
{
  "status": "success",
  "message": "Redirigiendo a Google para autenticación"
}
```

<h3 id="redirigealusuarioalapantalladelogindegoogleesteendpointredirigealusuarioalapantalladelogindegoogleparalaautenticacin-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

<h3 id="redirigealusuarioalapantalladelogindegoogleesteendpointredirigealusuarioalapantalladelogindegoogleparalaautenticacin-responseschema">Response Schema</h3>

Status Code **302**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## cambiaLaContraseaDelUsuarioEsteEndpointPermiteAlUsuarioCambiarSuContraseaUtilizandoUnUUIDParaIdentificarAlUsuario

<a id="opIdcambiaLaContraseaDelUsuarioEsteEndpointPermiteAlUsuarioCambiarSuContraseaUtilizandoUnUUIDParaIdentificarAlUsuario"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/auth/change-password \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://localhost/api/auth/change-password HTTP/1.1
Host: localhost
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "uuid": "66529e01-d113-3473-8d6f-9e11e09332ea",
  "new_password": "consequatur"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost/api/auth/change-password',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://localhost/api/auth/change-password',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://localhost/api/auth/change-password', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/auth/change-password', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/auth/change-password");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/auth/change-password", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/auth/change-password`

*Cambia la contraseña del usuario.

Este endpoint permite al usuario cambiar su contraseña utilizando un UUID para identificar al usuario.*

> Body parameter

```json
{
  "uuid": "66529e01-d113-3473-8d6f-9e11e09332ea",
  "new_password": "consequatur"
}
```

<h3 id="cambialacontraseadelusuarioesteendpointpermitealusuariocambiarsucontraseautilizandounuuidparaidentificaralusuario-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» uuid|body|string|true|El UUID del usuario. Ejemplo: 123e4567-e89b-12d3-a456-426614174000|
|» new_password|body|string|true|La nueva contraseña del usuario. Ejemplo: newpassword123|

> Example responses

> 200 Response

```json
{
  "status": "success",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "profile_pic": "http://profilepic.com/pic.jpg",
    "username": "johndoe"
  },
  "token": "your-generated-token"
}
```

<h3 id="cambialacontraseadelusuarioesteendpointpermitealusuariocambiarsucontraseautilizandounuuidparaidentificaralusuario-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

<h3 id="cambialacontraseadelusuarioesteendpointpermitealusuariocambiarsucontraseautilizandounuuidparaidentificaralusuario-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» user|object|false|none|none|
|»» id|integer|false|none|none|
|»» name|string|false|none|none|
|»» email|string|false|none|none|
|»» profile_pic|string|false|none|none|
|»» username|string|false|none|none|
|» token|string|false|none|none|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## verificaSiElUsuarioEstAutenticado

<a id="opIdverificaSiElUsuarioEstAutenticado"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/checkAuth \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/checkAuth HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/checkAuth',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/checkAuth',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/checkAuth', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/checkAuth', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/checkAuth");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/checkAuth", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/checkAuth`

*Verifica si el usuario está autenticado.*

> Example responses

> 200 Response

```json
{
  "status": "success",
  "user": {
    "id": 1,
    "name": "John Doe"
  }
}
```

<h3 id="verificasielusuarioestautenticado-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|

<h3 id="verificasielusuarioestautenticado-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» user|object|false|none|none|
|»» id|integer|false|none|none|
|»» name|string|false|none|none|

Status Code **401**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="laravel-api-documentation-endpoints">Endpoints</h1>

## getApiUser

<a id="opIdgetApiUser"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/user \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/user HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/user',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/user',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/user', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/user', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/user");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/user", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/user`

> Example responses

> 401 Response

```json
{
  "message": "Unauthenticated."
}
```

<h3 id="getapiuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|

<h3 id="getapiuser-responseschema">Response Schema</h3>

Status Code **401**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## getApiLanguages

<a id="opIdgetApiLanguages"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/languages \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/languages HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/languages',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/languages',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/languages', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/languages', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/languages");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/languages", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/languages`

> Example responses

> 401 Response

```json
{
  "message": "Unauthenticated."
}
```

<h3 id="getapilanguages-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|

<h3 id="getapilanguages-responseschema">Response Schema</h3>

Status Code **401**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## postApiUserLanguagesStore

<a id="opIdpostApiUserLanguagesStore"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/user/languages/store \
  -H 'Content-Type: application/json'

```

```http
POST http://localhost/api/user/languages/store HTTP/1.1
Host: localhost
Content-Type: application/json

```

```javascript
const inputBody = '{
  "id_language": "consequatur"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost/api/user/languages/store',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.post 'http://localhost/api/user/languages/store',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.post('http://localhost/api/user/languages/store', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/user/languages/store', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/user/languages/store");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/user/languages/store", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/user/languages/store`

> Body parameter

```json
{
  "id_language": "consequatur"
}
```

<h3 id="postapiuserlanguagesstore-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id_language|body|string|true|none|

<h3 id="postapiuserlanguagesstore-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## getApiGamesLanguage

<a id="opIdgetApiGamesLanguage"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/games/{language} \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/games/{language} HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/games/{language}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/games/{language}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/games/{language}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/games/{language}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/games/{language}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/games/{language}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/games/{language}`

<h3 id="getapigameslanguage-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|language|path|string|true|none|

> Example responses

> 401 Response

```json
{
  "message": "Unauthenticated."
}
```

<h3 id="getapigameslanguage-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|

<h3 id="getapigameslanguage-responseschema">Response Schema</h3>

Status Code **401**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## postApiGameStoreStatsUser

<a id="opIdpostApiGameStoreStatsUser"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/game/store/stats/user

```

```http
POST http://localhost/api/game/store/stats/user HTTP/1.1
Host: localhost

```

```javascript

fetch('http://localhost/api/game/store/stats/user',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.post 'http://localhost/api/game/store/stats/user',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.post('http://localhost/api/game/store/stats/user')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/game/store/stats/user', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/game/store/stats/user");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/game/store/stats/user", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/game/store/stats/user`

<h3 id="postapigamestorestatsuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## postApiGameStoreStatsFinish

<a id="opIdpostApiGameStoreStatsFinish"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/game/store/stats/finish

```

```http
POST http://localhost/api/game/store/stats/finish HTTP/1.1
Host: localhost

```

```javascript

fetch('http://localhost/api/game/store/stats/finish',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.post 'http://localhost/api/game/store/stats/finish',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.post('http://localhost/api/game/store/stats/finish')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/game/store/stats/finish', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/game/store/stats/finish");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/game/store/stats/finish", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/game/store/stats/finish`

<h3 id="postapigamestorestatsfinish-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## postApiGameHistoryRound

<a id="opIdpostApiGameHistoryRound"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/game/history/round

```

```http
POST http://localhost/api/game/history/round HTTP/1.1
Host: localhost

```

```javascript

fetch('http://localhost/api/game/history/round',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.post 'http://localhost/api/game/history/round',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.post('http://localhost/api/game/history/round')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/game/history/round', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/game/history/round");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/game/history/round", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/game/history/round`

<h3 id="postapigamehistoryround-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## postApiUserUpdate

<a id="opIdpostApiUserUpdate"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/user/update \
  -H 'Content-Type: application/json'

```

```http
POST http://localhost/api/user/update HTTP/1.1
Host: localhost
Content-Type: application/json

```

```javascript
const inputBody = '{
  "email": "qkunze@example.com",
  "name": "opfuudtdsufvyvddqamni",
  "username": null,
  "profile_pic": "http://www.grady.com/aspernatur-natus-earum-quas-dignissimos-perferendis-voluptatibus",
  "password": []
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost/api/user/update',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.post 'http://localhost/api/user/update',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.post('http://localhost/api/user/update', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/user/update', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/user/update");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/user/update", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/user/update`

> Body parameter

```json
{
  "email": "qkunze@example.com",
  "name": "opfuudtdsufvyvddqamni",
  "username": null,
  "profile_pic": "http://www.grady.com/aspernatur-natus-earum-quas-dignissimos-perferendis-voluptatibus",
  "password": []
}
```

<h3 id="postapiuserupdate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|
|» email|body|string¦null|false|Must be a valid email address.|
|» name|body|string¦null|false|Must not be greater than 255 characters.|
|» username|body|string|false|none|
|» profile_pic|body|string¦null|false|Must be a valid URL.|
|» password|body|object|false|none|
|»» current|body|string|false|Si se quiere cambiar la contraseña, deben venir ambos campos. This field is required when <code>password.new</code> is present. Must be at least 6 characters.|
|»» new|body|string|false|This field is required when <code>password.current</code> is present.  The value and <code>password.current</code> must be different. Must be at least 6 characters.|

<h3 id="postapiuserupdate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## getApiTest

<a id="opIdgetApiTest"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/test \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/test HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/test',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/test',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/test', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/test', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/test");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/test", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/test`

> Example responses

> 200 Response

```json
{
  "message": "Test route is working!"
}
```

<h3 id="getapitest-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="getapitest-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="laravel-api-documentation-game">Game</h1>

## almacenaLasEstadsticasDeLosJugadoresAlFinalDeUnJuegoEsteEndpointPermiteActualizarLasEstadsticasDeLosJugadoresSumandoLosPuntosLocalesDeCadaUno

<a id="opIdalmacenaLasEstadsticasDeLosJugadoresAlFinalDeUnJuegoEsteEndpointPermiteActualizarLasEstadsticasDeLosJugadoresSumandoLosPuntosLocalesDeCadaUno"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/game/store/stats \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://localhost/api/game/store/stats HTTP/1.1
Host: localhost
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "players": [
    "consequatur"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost/api/game/store/stats',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://localhost/api/game/store/stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://localhost/api/game/store/stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/game/store/stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/game/store/stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/game/store/stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/game/store/stats`

*Almacena las estadísticas de los jugadores al final de un juego.

Este endpoint permite actualizar las estadísticas de los jugadores, sumando los puntos locales de cada uno.*

> Body parameter

```json
{
  "players": [
    "consequatur"
  ]
}
```

<h3 id="almacenalasestadsticasdelosjugadoresalfinaldeunjuegoesteendpointpermiteactualizarlasestadsticasdelosjugadoressumandolospuntoslocalesdecadauno-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» players|body|[string]|true|Lista de jugadores con sus ID y puntos locales. Ejemplo:|

#### Detailed descriptions

**» players**: Lista de jugadores con sus ID y puntos locales. Ejemplo:
[
    { "id": 1, "localPoints": 10 },
    { "id": 2, "localPoints": 5 }
]

> Example responses

> 200 Response

```json
{
  "status": "success"
}
```

<h3 id="almacenalasestadsticasdelosjugadoresalfinaldeunjuegoesteendpointpermiteactualizarlasestadsticasdelosjugadoressumandolospuntoslocalesdecadauno-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

<h3 id="almacenalasestadsticasdelosjugadoresalfinaldeunjuegoesteendpointpermiteactualizarlasestadsticasdelosjugadoressumandolospuntoslocalesdecadauno-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## obtieneLaListaDeJuegosQueEstnEnEstadopendingpendienteEsteEndpointDevuelveTodosLosJuegosQueEstnEnEsperaDeSerIniciados

<a id="opIdobtieneLaListaDeJuegosQueEstnEnEstadopendingpendienteEsteEndpointDevuelveTodosLosJuegosQueEstnEnEsperaDeSerIniciados"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/games \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/games HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/games',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/games',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/games', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/games', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/games");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/games", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/games`

*Obtiene la lista de juegos que están en estado "pending" (pendiente).

Este endpoint devuelve todos los juegos que están en espera de ser iniciados.*

> Example responses

> 200 Response

```json
{
  "status": "success",
  "message": "Games list",
  "games": [
    {
      "id": 1,
      "name": "Game 1",
      "status": "pending",
      "participants": [
        {
          "user": {
            "name": "Player 1",
            "email": "player1@example.com"
          }
        }
      ],
      "language_level": {
        "language": {
          "name": "English"
        }
      }
    }
  ]
}
```

<h3 id="obtienelalistadejuegosqueestnenestadopendingpendienteesteendpointdevuelvetodoslosjuegosqueestnenesperadeseriniciados-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

<h3 id="obtienelalistadejuegosqueestnenestadopendingpendienteesteendpointdevuelvetodoslosjuegosqueestnenesperadeseriniciados-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|
|» games|[object]|false|none|none|
|»» id|integer|false|none|none|
|»» name|string|false|none|none|
|»» status|string|false|none|none|
|»» participants|[object]|false|none|none|
|»»» user|object|false|none|none|
|»»»» name|string|false|none|none|
|»»»» email|string|false|none|none|
|»» language_level|object|false|none|none|
|»»» language|object|false|none|none|
|»»»» name|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## creaUnNuevoJuegoEsteEndpointPermiteCrearUnNuevoJuegoEspecificandoLaConfiguracinDeEsteComoElNivelDeLenguajeLasRondasElMximoDePistasEtc

<a id="opIdcreaUnNuevoJuegoEsteEndpointPermiteCrearUnNuevoJuegoEspecificandoLaConfiguracinDeEsteComoElNivelDeLenguajeLasRondasElMximoDePistasEtc"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/games/store \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

```http
POST http://localhost/api/games/store HTTP/1.1
Host: localhost
Content-Type: application/json
Accept: text/plain

```

```javascript
const inputBody = '{
  "id_level_language": 17,
  "password": "O[2UZ5ij-e/dl4m{o,",
  "name": "consequatur",
  "n_rounds": 17,
  "max_clues": 17,
  "max_time": 17,
  "max_players": 17
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'text/plain'
};

fetch('http://localhost/api/games/store',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'text/plain'
}

result = RestClient.post 'http://localhost/api/games/store',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'text/plain'
}

r = requests.post('http://localhost/api/games/store', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'text/plain',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/games/store', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/games/store");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"text/plain"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/games/store", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/games/store`

*Crea un nuevo juego.

Este endpoint permite crear un nuevo juego, especificando la configuración de este, como el nivel de lenguaje, las rondas, el máximo de pistas, etc.*

> Body parameter

```json
{
  "id_level_language": 17,
  "password": "O[2UZ5ij-e/dl4m{o,",
  "name": "consequatur",
  "n_rounds": 17,
  "max_clues": 17,
  "max_time": 17,
  "max_players": 17
}
```

<h3 id="creaunnuevojuegoesteendpointpermitecrearunnuevojuegoespecificandolaconfiguracindeestecomoelniveldelenguajelasrondaselmximodepistasetc-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id_level_language|body|integer|true|El ID del nivel de lenguaje para el juego. Ejemplo: 1|
|» password|body|string|true|La contraseña del juego. Ejemplo: "secreta123"|
|» name|body|string|true|El nombre del juego. Ejemplo: "Trivia Game"|
|» n_rounds|body|integer|true|El número de rondas del juego. Ejemplo: 5|
|» max_clues|body|integer|true|El máximo de pistas por ronda. Ejemplo: 3|
|» max_time|body|integer|true|El tiempo máximo en segundos por ronda. Ejemplo: 60|
|» max_players|body|integer|true|El número máximo de jugadores en el juego. Ejemplo: 4|

> Example responses

> 200 Response

```
"{\n    \"status\": \"success\",\n    \"message\": \"Game created\",\n    \"gameCreated\": {\n        \"id\": 1,\n        \"name\": \"Trivia Game\",\n        \"status\": \"pending\"\n    },\n    \"games\": [...]\n}"
```

> 422 Response

```json
{
  "status": "error",
  "errors": {
    "name": [
      "The name field is required."
    ]
  }
}
```

<h3 id="creaunnuevojuegoesteendpointpermitecrearunnuevojuegoespecificandolaconfiguracindeestecomoelniveldelenguajelasrondaselmximodepistasetc-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|string|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

<h3 id="creaunnuevojuegoesteendpointpermitecrearunnuevojuegoespecificandolaconfiguracindeestecomoelniveldelenguajelasrondaselmximodepistasetc-responseschema">Response Schema</h3>

Status Code **422**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» errors|object|false|none|none|
|»» name|[string]|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## obtieneLosDetallesDeUnJuegoEspecficoPorSuUUIDEsteEndpointDevuelveLosDetallesDelJuegoIncluyendoLosParticipantesYElNivelDeLenguajeSiElJuegoEstEnEstadopendingOinProgress

<a id="opIdobtieneLosDetallesDeUnJuegoEspecficoPorSuUUIDEsteEndpointDevuelveLosDetallesDelJuegoIncluyendoLosParticipantesYElNivelDeLenguajeSiElJuegoEstEnEstadopendingOinProgress"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/games/lobby/{gameUUID} \
  -H 'Accept: text/plain'

```

```http
GET http://localhost/api/games/lobby/{gameUUID} HTTP/1.1
Host: localhost
Accept: text/plain

```

```javascript

const headers = {
  'Accept':'text/plain'
};

fetch('http://localhost/api/games/lobby/{gameUUID}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'text/plain'
}

result = RestClient.get 'http://localhost/api/games/lobby/{gameUUID}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'text/plain'
}

r = requests.get('http://localhost/api/games/lobby/{gameUUID}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'text/plain',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/games/lobby/{gameUUID}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/games/lobby/{gameUUID}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"text/plain"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/games/lobby/{gameUUID}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/games/lobby/{gameUUID}`

*Obtiene los detalles de un juego específico por su UUID.

Este endpoint devuelve los detalles del juego, incluyendo los participantes y el nivel de lenguaje, si el juego está en estado "pending" o "in_progress".*

<h3 id="obtienelosdetallesdeunjuegoespecficoporsuuuidesteendpointdevuelvelosdetallesdeljuegoincluyendolosparticipantesyelniveldelenguajesieljuegoestenestadopendingoinprogress-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|gameUUID|path|string|true|El UUID del juego. Ejemplo: "123e4567-e89b-12d3-a456-426614174000"|

> Example responses

> 200 Response

```
"{\n    \"status\": \"success\",\n    \"game\": {\n        \"id\": 1,\n        \"name\": \"Trivia Game\",\n        \"status\": \"pending\",\n        \"participants\": [...],\n        \"language_level\": {\n            \"language\": {\n                \"name\": \"English\"\n            }\n        }\n    }\n}"
```

> 404 Response

```json
{
  "status": "error",
  "message": "Game not found"
}
```

<h3 id="obtienelosdetallesdeunjuegoespecficoporsuuuidesteendpointdevuelvelosdetallesdeljuegoincluyendolosparticipantesyelniveldelenguajesieljuegoestenestadopendingoinprogress-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|string|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

<h3 id="obtienelosdetallesdeunjuegoespecficoporsuuuidesteendpointdevuelvelosdetallesdeljuegoincluyendolosparticipantesyelniveldelenguajesieljuegoestenestadopendingoinprogress-responseschema">Response Schema</h3>

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## permiteAUnUsuarioUnirseAUnJuegoEnEstadopendingEsteEndpointAgregaUnUsuarioAlJuegoComoParticipante

<a id="opIdpermiteAUnUsuarioUnirseAUnJuegoEnEstadopendingEsteEndpointAgregaUnUsuarioAlJuegoComoParticipante"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/games/join/{gameUUID} \
  -H 'Accept: text/plain'

```

```http
GET http://localhost/api/games/join/{gameUUID} HTTP/1.1
Host: localhost
Accept: text/plain

```

```javascript

const headers = {
  'Accept':'text/plain'
};

fetch('http://localhost/api/games/join/{gameUUID}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'text/plain'
}

result = RestClient.get 'http://localhost/api/games/join/{gameUUID}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'text/plain'
}

r = requests.get('http://localhost/api/games/join/{gameUUID}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'text/plain',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/games/join/{gameUUID}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/games/join/{gameUUID}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"text/plain"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/games/join/{gameUUID}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/games/join/{gameUUID}`

*Permite a un usuario unirse a un juego en estado "pending".

Este endpoint agrega un usuario al juego como participante.*

<h3 id="permiteaunusuariounirseaunjuegoenestadopendingesteendpointagregaunusuarioaljuegocomoparticipante-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|gameUUID|path|string|true|El UUID del juego al que se unirá el usuario. Ejemplo: "123e4567-e89b-12d3-a456-426614174000"|

> Example responses

> 200 Response

```
"{\n    \"status\": \"success\",\n    \"games\": [...],\n    \"game\": {\n        \"id\": 1,\n        \"name\": \"Trivia Game\",\n        \"status\": \"pending\"\n    }\n}"
```

> 404 Response

```json
{
  "status": "error",
  "message": "Game not found"
}
```

<h3 id="permiteaunusuariounirseaunjuegoenestadopendingesteendpointagregaunusuarioaljuegocomoparticipante-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|string|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

<h3 id="permiteaunusuariounirseaunjuegoenestadopendingesteendpointagregaunusuarioaljuegocomoparticipante-responseschema">Response Schema</h3>

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## permiteAUnUsuarioAbandonarUnJuegoEsteEndpointPermiteAUnUsuarioDejarUnJuegoSiElUsuarioEsElHostSeEliminarnTodosLosParticipantesYElJuego

<a id="opIdpermiteAUnUsuarioAbandonarUnJuegoEsteEndpointPermiteAUnUsuarioDejarUnJuegoSiElUsuarioEsElHostSeEliminarnTodosLosParticipantesYElJuego"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/games/leave/{gameUUID} \
  -H 'Accept: text/plain'

```

```http
GET http://localhost/api/games/leave/{gameUUID} HTTP/1.1
Host: localhost
Accept: text/plain

```

```javascript

const headers = {
  'Accept':'text/plain'
};

fetch('http://localhost/api/games/leave/{gameUUID}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'text/plain'
}

result = RestClient.get 'http://localhost/api/games/leave/{gameUUID}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'text/plain'
}

r = requests.get('http://localhost/api/games/leave/{gameUUID}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'text/plain',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/games/leave/{gameUUID}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/games/leave/{gameUUID}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"text/plain"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/games/leave/{gameUUID}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/games/leave/{gameUUID}`

*Permite a un usuario abandonar un juego.

Este endpoint permite a un usuario dejar un juego. Si el usuario es el host, se eliminarán todos los participantes y el juego.*

<h3 id="permiteaunusuarioabandonarunjuegoesteendpointpermiteaunusuariodejarunjuegosielusuarioeselhostseeliminarntodoslosparticipantesyeljuego-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|gameUUID|path|string|true|El UUID del juego. Ejemplo: "123e4567-e89b-12d3-a456-426614174000"|

> Example responses

> 200 Response

```
"{\n    \"status\": \"success\",\n    \"games\": [...]\n}"
```

> 404 Response

```json
{
  "status": "error",
  "message": "Game not found"
}
```

<h3 id="permiteaunusuarioabandonarunjuegoesteendpointpermiteaunusuariodejarunjuegosielusuarioeselhostseeliminarntodoslosparticipantesyeljuego-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|string|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

<h3 id="permiteaunusuarioabandonarunjuegoesteendpointpermiteaunusuariodejarunjuegosielusuarioeselhostseeliminarntodoslosparticipantesyeljuego-responseschema">Response Schema</h3>

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## iniciaUnJuegoQueEstEnEstadopendingEsteEndpointCambiaElEstadoDelJuegoAinProgressYComienzaLaPartida

<a id="opIdiniciaUnJuegoQueEstEnEstadopendingEsteEndpointCambiaElEstadoDelJuegoAinProgressYComienzaLaPartida"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/games/start \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://localhost/api/games/start HTTP/1.1
Host: localhost
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "roomUUID": "66529e01-d113-3473-8d6f-9e11e09332ea"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost/api/games/start',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://localhost/api/games/start',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://localhost/api/games/start', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/games/start', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/games/start");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/games/start", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/games/start`

*Inicia un juego que está en estado "pending".

Este endpoint cambia el estado del juego a "in_progress" y comienza la partida.*

> Body parameter

```json
{
  "roomUUID": "66529e01-d113-3473-8d6f-9e11e09332ea"
}
```

<h3 id="iniciaunjuegoqueestenestadopendingesteendpointcambiaelestadodeljuegoainprogressycomienzalapartida-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» roomUUID|body|string|true|El UUID del juego que se va a iniciar. Ejemplo: "123e4567-e89b-12d3-a456-426614174000"|

> Example responses

> 200 Response

```json
{
  "status": "success",
  "message": "Game started",
  "data": {
    "id": 1,
    "name": "Trivia Game",
    "status": "in_progress"
  }
}
```

<h3 id="iniciaunjuegoqueestenestadopendingesteendpointcambiaelestadodeljuegoainprogressycomienzalapartida-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

<h3 id="iniciaunjuegoqueestenestadopendingesteendpointcambiaelestadodeljuegoainprogressycomienzalapartida-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|
|» data|object|false|none|none|
|»» id|integer|false|none|none|
|»» name|string|false|none|none|
|»» status|string|false|none|none|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="laravel-api-documentation-statsuserlanguage">StatsUserLanguage</h1>

## obtieneLasEstadsticasDeLosIdiomasDeUnUsuarioEsteEndpointDevuelveLasEstadsticasDeLosIdiomasAprendidosPorElUsuarioAutenticadoJuntoConLaInformacinDelIdioma

<a id="opIdobtieneLasEstadsticasDeLosIdiomasDeUnUsuarioEsteEndpointDevuelveLasEstadsticasDeLosIdiomasAprendidosPorElUsuarioAutenticadoJuntoConLaInformacinDelIdioma"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/user/languages \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/user/languages HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/user/languages',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/user/languages',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/user/languages', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/user/languages', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/user/languages");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/user/languages", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/user/languages`

*Obtiene las estadísticas de los idiomas de un usuario.

Este endpoint devuelve las estadísticas de los idiomas aprendidos por el usuario autenticado, junto con la información del idioma.*

> Example responses

> 200 Response

```json
{
  "status": "success",
  "statsLanguages": [
    {
      "id": 1,
      "user_id": 1,
      "language_id": 1,
      "level": 5,
      "language": {
        "id": 1,
        "name": "English"
      }
    }
  ]
}
```

<h3 id="obtienelasestadsticasdelosidiomasdeunusuarioesteendpointdevuelvelasestadsticasdelosidiomasaprendidosporelusuarioautenticadojuntoconlainformacindelidioma-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

<h3 id="obtienelasestadsticasdelosidiomasdeunusuarioesteendpointdevuelvelasestadsticasdelosidiomasaprendidosporelusuarioautenticadojuntoconlainformacindelidioma-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» statsLanguages|[object]|false|none|none|
|»» id|integer|false|none|none|
|»» user_id|integer|false|none|none|
|»» language_id|integer|false|none|none|
|»» level|integer|false|none|none|
|»» language|object|false|none|none|
|»»» id|integer|false|none|none|
|»»» name|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## obtieneLasEstadsticasDeUnIdiomaEspecficoDeUnUsuarioEsteEndpointDevuelveLasEstadsticasDeUnIdiomaEspecficoDelUsuarioLosLogrosRelacionadosConEseIdiomaYElHistorialDeJuegosMsRecientesDelUsuario

<a id="opIdobtieneLasEstadsticasDeUnIdiomaEspecficoDeUnUsuarioEsteEndpointDevuelveLasEstadsticasDeUnIdiomaEspecficoDelUsuarioLosLogrosRelacionadosConEseIdiomaYElHistorialDeJuegosMsRecientesDelUsuario"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/user/getUserStatsLanguage/{language} \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/user/getUserStatsLanguage/{language} HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/user/getUserStatsLanguage/{language}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/user/getUserStatsLanguage/{language}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/user/getUserStatsLanguage/{language}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/user/getUserStatsLanguage/{language}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/user/getUserStatsLanguage/{language}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/user/getUserStatsLanguage/{language}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/user/getUserStatsLanguage/{language}`

*Obtiene las estadísticas de un idioma específico de un usuario.

Este endpoint devuelve las estadísticas de un idioma específico del usuario, los logros relacionados con ese idioma y el historial de juegos más recientes del usuario.*

<h3 id="obtienelasestadsticasdeunidiomaespecficodeunusuarioesteendpointdevuelvelasestadsticasdeunidiomaespecficodelusuarioloslogrosrelacionadosconeseidiomayelhistorialdejuegosmsrecientesdelusuario-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|language|path|string|true|none|
|languageId|path|integer|true|El ID del idioma para obtener las estadísticas del usuario. Ejemplo: 1|

> Example responses

> 200 Response

```json
{
  "status": "success",
  "statsLanguage": {
    "id": 1,
    "user_id": 1,
    "language_id": 1,
    "level": 5
  },
  "achievements": [
    {
      "achievement_id": 1,
      "progress": 80,
      "achievement": {
        "name": "Proficient in English"
      }
    }
  ],
  "gameHistoryUser": [
    {
      "id": 1,
      "user_id": 1,
      "created_at": "2025-03-28T12:00:00",
      "rounds": [
        {
          "score": 10,
          "duration": 30
        }
      ]
    }
  ]
}
```

<h3 id="obtienelasestadsticasdeunidiomaespecficodeunusuarioesteendpointdevuelvelasestadsticasdeunidiomaespecficodelusuarioloslogrosrelacionadosconeseidiomayelhistorialdejuegosmsrecientesdelusuario-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

<h3 id="obtienelasestadsticasdeunidiomaespecficodeunusuarioesteendpointdevuelvelasestadsticasdeunidiomaespecficodelusuarioloslogrosrelacionadosconeseidiomayelhistorialdejuegosmsrecientesdelusuario-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» statsLanguage|object|false|none|none|
|»» id|integer|false|none|none|
|»» user_id|integer|false|none|none|
|»» language_id|integer|false|none|none|
|»» level|integer|false|none|none|
|» achievements|[object]|false|none|none|
|»» achievement_id|integer|false|none|none|
|»» progress|integer|false|none|none|
|»» achievement|object|false|none|none|
|»»» name|string|false|none|none|
|» gameHistoryUser|[object]|false|none|none|
|»» id|integer|false|none|none|
|»» user_id|integer|false|none|none|
|»» created_at|string|false|none|none|
|»» rounds|[object]|false|none|none|
|»»» score|integer|false|none|none|
|»»» duration|integer|false|none|none|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="laravel-api-documentation-translation">Translation</h1>

## obtieneLaListaDeIdiomasSoportadosPorElServicioDeLaraEsteEndpointDevuelveTodosLosIdiomasSoportadosParaTraduccinTambinPermiteObtenerLosNombresDeLosIdiomasEnUnIdiomaEspecfico

<a id="opIdobtieneLaListaDeIdiomasSoportadosPorElServicioDeLaraEsteEndpointDevuelveTodosLosIdiomasSoportadosParaTraduccinTambinPermiteObtenerLosNombresDeLosIdiomasEnUnIdiomaEspecfico"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost/api/lara/languages \
  -H 'Accept: application/json'

```

```http
GET http://localhost/api/lara/languages HTTP/1.1
Host: localhost
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost/api/lara/languages',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://localhost/api/lara/languages',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://localhost/api/lara/languages', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost/api/lara/languages', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/lara/languages");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost/api/lara/languages", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/lara/languages`

*Obtiene la lista de idiomas soportados por el servicio de Lara.

Este endpoint devuelve todos los idiomas soportados para traducción. También permite obtener los nombres de los idiomas en un idioma específico.*

<h3 id="obtienelalistadeidiomassoportadosporelserviciodelaraesteendpointdevuelvetodoslosidiomassoportadosparatraduccintambinpermiteobtenerlosnombresdelosidiomasenunidiomaespecfico-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|display_language|query|string|false|El idioma en el que se mostrarán los nombres de los idiomas soportados. Por defecto, es 'es' (español). Ejemplo: "es"|

> Example responses

> 200 Response

```json
{
  "languages": [
    {
      "code": "en",
      "name": "Inglés"
    },
    {
      "code": "es",
      "name": "Español"
    }
  ]
}
```

<h3 id="obtienelalistadeidiomassoportadosporelserviciodelaraesteendpointdevuelvetodoslosidiomassoportadosparatraduccintambinpermiteobtenerlosnombresdelosidiomasenunidiomaespecfico-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

<h3 id="obtienelalistadeidiomassoportadosporelserviciodelaraesteendpointdevuelvetodoslosidiomassoportadosparatraduccintambinpermiteobtenerlosnombresdelosidiomasenunidiomaespecfico-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» languages|[object]|false|none|none|
|»» code|string|false|none|none|
|»» name|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## traduceUnaPalabraOFraseDeUnIdiomaAOtroUtilizandoElServicioDeLaraEsteEndpointTomaUnaPalabraOFraseYLaTraduceDeUnIdiomaAOtroElIdiomaDeOrigenEsOpcionalYSiNoSeProporcionaGooglePuedeDetectarloAutomticamente

<a id="opIdtraduceUnaPalabraOFraseDeUnIdiomaAOtroUtilizandoElServicioDeLaraEsteEndpointTomaUnaPalabraOFraseYLaTraduceDeUnIdiomaAOtroElIdiomaDeOrigenEsOpcionalYSiNoSeProporcionaGooglePuedeDetectarloAutomticamente"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost/api/lara/translate \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://localhost/api/lara/translate HTTP/1.1
Host: localhost
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "word": "consequatur",
  "target": "consequatur",
  "source": "consequatur"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost/api/lara/translate',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://localhost/api/lara/translate',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://localhost/api/lara/translate', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost/api/lara/translate', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost/api/lara/translate");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost/api/lara/translate", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/lara/translate`

*Traduce una palabra o frase de un idioma a otro utilizando el servicio de Lara.

Este endpoint toma una palabra o frase y la traduce de un idioma a otro. El idioma de origen es opcional y, si no se proporciona, Google puede detectarlo automáticamente.*

> Body parameter

```json
{
  "word": "consequatur",
  "target": "consequatur",
  "source": "consequatur"
}
```

<h3 id="traduceunapalabraofrasedeunidiomaaotroutilizandoelserviciodelaraesteendpointtomaunapalabraofraseylatraducedeunidiomaaotroelidiomadeorigenesopcionalysinoseproporcionagooglepuededetectarloautomticamente-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» word|body|string|true|La palabra o frase a traducir. Ejemplo: "Hello"|
|» target|body|string|true|El código ISO de 2 letras del idioma de destino (es, en, fr, etc.). Ejemplo: "es"|
|» source|body|string¦null|false|Opcional El código ISO de 2 letras del idioma de origen (en, fr, etc.). Ejemplo: "en". Si no se proporciona, se detectará automáticamente.|

> Example responses

> 200 Response

```json
{
  "status": "success",
  "result": "Hola"
}
```

<h3 id="traduceunapalabraofrasedeunidiomaaotroutilizandoelserviciodelaraesteendpointtomaunapalabraofraseylatraducedeunidiomaaotroelidiomadeorigenesopcionalysinoseproporcionagooglepuededetectarloautomticamente-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

<h3 id="traduceunapalabraofrasedeunidiomaaotroutilizandoelserviciodelaraesteendpointtomaunapalabraofraseylatraducedeunidiomaaotroelidiomadeorigenesopcionalysinoseproporcionagooglepuededetectarloautomticamente-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» result|string|false|none|none|

Status Code **422**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

