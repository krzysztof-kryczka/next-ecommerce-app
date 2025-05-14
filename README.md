# NexusHub – E-commerce Platform

## 📌 Opis projektu

NexusHub to nowoczesna platforma e-commerce, zaprojektowana tak, aby zapewnić użytkownikom wygodne, bezpieczne i intuicyjne zakupy. System daje pełną kontrolę nad procesem wyboru produktów, dodawania ich do koszyka i finalizacji zamówienia.

Przeglądanie produktów jest z możliwością filtrowania według różnych kryteriów. Użytkownik może wybrać kategorię, a także preferowaną walutę płatności. System obsługuje cztery waluty, a po ich zmianie automatycznie przelicza wszystkie ceny.

Po znalezieniu interesującego produktu można go dodać do koszyka. Jednak przed dodaniem system sprawdza, czy użytkownik jest zalogowany, aby zapewnić bezpieczeństwo transakcji i personalizację zakupów. Koszyk działa na API, co oznacza, że produkty są przechowywane na serwerze, a nie tylko w Local Storage – dzięki temu użytkownik może zalogować się z dowolnego miejsca i mieć dostęp do swoich zapisanych produktów.

Przy finalizacji zamówienia użytkownik nie musi kupować wszystkiego naraz – może wybrać tylko te produkty, które chce teraz zapłacić, a reszta zostanie w koszyku na przyszłość. Wybrane pozycje są przekazywane do pre procesu checkout, gdzie następuje kluczowa weryfikacja. System sprawdza, czy użytkownik nie manipulował danymi w Local Storage, np. zmieniając cenę lub ilość produktów by zapłacić taniej. Jeśli wszystko zgadza się z zapisanymi informacjami na serwerze w koszyku zakupowym, można przejść do płatności w Stripe.

**OGRANICZENIA: Limit 500 znaków matadanych przekazywanych do Stripe. Jeśli pojawi się komunikat o błędzie, należy wybrać mniejszą ilość produktów i spróbować ponownie. W przyszłości Nowa wersja checkoutu zostanie przeprojektowana i pozwoli na obsługę większych zamówień bez konieczności ich dzielenia, co sprawi, że zakupy będą jeszcze łatwiejsze i płynniejsze dla użytkownika.**

Po dokonaniu transakcji użytkownik otrzymuje podsumowanie zamówienia, a w magazynie automatycznie aktualizowany jest stan zapasów. Z koszyka usuwane są tylko te produkty, za które faktycznie zapłacono – reszta pozostaje do późniejszego zakupu. Dodatkowo generowane są szczegóły transakcji, które pomagają w zarządzaniu historią zakupów w profilu użytkownika.

NexusHub to system, który nie tylko dba o wygodę użytkownika, ale także gwarantuje bezpieczeństwo, elastyczność i globalną dostępność. Możliwość płatności w różnych walutach, przechowywanie koszyka na serwerze i zaawansowane zabezpieczenia sprawiają, że zakupy są proste, transparentne i dostosowane do potrzeb klientów.

## 🚀 Instalacja

Aby uruchomić projekt lokalnie, wykonaj następujące kroki:

1. **Klonowanie repozytorium:**
   ```
   git clone https://github.com/krzysztof-kryczka/next-ecommerce-app
   cd next-ecommerce-app
   ```
2. **Wybór Gałęzi (branch):**
   ```
   $ git branch -a
   $ git switch dev
   lub jeśli wolisz archaiczne rozwiązanie to:
   $ git checkout dev
   ```
3. **Konfiguracja środowiska:**
   Stwórz w głównym katalogu projerktu plik .env i dodaj:
   ```
   DATABASE_URL=
   NEXTAUTH_URL=
   NEXTAUTH_SECRET=
   STRIPE_SECRET_KEY=
   STRIPE_PUBLISHABLE_KEY=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   ```
4. **Instalacja zależności:**
   ```
   $ npm install
   $ npx prisma generate
   $ npx prisma migrate deploy
   $ tsx prisma/seed.ts lub npm run seed
   ```
5. **Uruchamianie Aplikacji w trybie developerskim:**
   ```
   Jeżeli baza PostgreSQL jest przez docker
      $ npm run start:db
      $ npm run dev
   Jeżeli neon:
      $ npm run dev
   ```

📂 Struktura projektu

    .
    │── app/
    │   ├── api/               # API backendowe
    │   ├── cart/              # Strona koszyka
    │   ├── checkout/          # Strona płatności
    │   ├── login/             # Strona logowania
    │   ├── register/          # Strona rejestracji
    │   ├── products/          # Lista produktów
    │   ├── user-profile/      # Profil użytkownika
    │── components/              @ mniejsze elementy składowe komponentów jsx +
    │   ├── icons/             # Ikony używane w aplikacji
    │   ├── ui/                # Komponenty UI z shaDCN + własne
    │── context/               # Konteksty aplikacji (waluty, kategorie)
    │── hooks/                 # Customowe hooki do pobierania danych z api
    │── lib/                   # Pomocnicze funkcje
    │── schema/                # Walidacja danych
    │── types/                 # Typy dla TypeScript
    │── utils/                 # Narzędzia i pomocnicze funkcje
    │── middleware.ts          # Middleware aplikacji
    │── README.md              # Dokumentacja projektu

# 📌 Struktura API

API jest podzielone na osobne moduły, które obsługują różne części aplikacji:

## 🔑 Autoryzacja (/api/auth/)

- **POST /api/login/** – Logowanie użytkownika.
- **POST /api/register/** – Rejestracja nowego użytkownika.
- **GET /api/check-user/** – Pomocnicza - sprawdza, czy użytkownik istnieje w bazie jeszcze przed podaniem hasła.

## 🏷 Kategorie (/api/categories/)

- **GET /api/categories/** – Pobiera wszystkie dostępne kategorie produktów.

## 🛍 Produkty (/api/products/)

- **GET /api/products/** – Pobiera listę wszystkich produktów.
- **GET /api/product/{id}** – Pobiera szczegóły pojedynczego produktu na podstawie id.

## 🔄 Rekomendacje (/api/recommendations/)

- **GET /api/recommendations/** – Pobiera losowo 6 rekomendowanych produktów dla użytkownika.

## 🛒 Koszyk (/api/cart/)

- **GET /api/cart/** – Pobiera zawartość koszyka użytkownika.
- **POST /api/cart/** – Dodaje produkt do koszyka.
- **DELETE /api/cart/** – Usuwa produkt z koszyka.
- **POST /api/validate-checkout/** – Walidacja przed złożeniem zamówienia czy dane posiadane w localStorage nie zostały zmodyfikowane przez użytkownika (weryfikuje z tym co użytkownik posiada w koszyku)
- **POST /api/clear-cart/** – Usuwa z koszyka tylko te produkty po dokonaniu zakupu, które użytkownik faktycznie zakupił i które trafiły do checkout. Pozostałe produkty pozostają w koszyku.

## 💳 Płatności (/api/create-checkout-session/)

- **POST /api/create-checkout-session/** – Tworzy sesję płatności Stripe.
- **GET /api/session-details/** – Wyciąganie szczegółów zamówienia z przetworzonej płatności Stripe.

## 🚚 Zamówienia (/api/orders/)

- **GET /api/orders/** – Pobiera historię zamówień użytkownika.
- **GET /api/orders/exists/** – Sprawdza, czy użytkownik ma aktywne zamówienie.

## 🔑 Profil użytkownika (/api/user-profile/)

- **GET /api/user-profile/** – Pobiera dane profilu użytkownika.
- **PATCH /api/user-profile/** – Aktualizuje dane użytkownika.

## 📦 Zarządzanie stanem magazynowym (/api/update-stock/)

- **POST /api/update-stock/** – Aktualizuje stan magazynowy produktów po zakupie.

## 📍 Zarządzanie adresami (/api/addresses/)

- **GET /api/addresses/** – Pobiera zapisane adresy użytkownika.
- **POST /api/addresses/** – Dodaje nowy adres użytkownika.
- **PATCH /api/addresses/** – Aktualizuje adres użytkownika.
- **DELETE /api/addresses/** – Usuwa zapisany adres użytkownika.
