# NexusHub – E-commerce Platform

## 📌 Opis projektu

NexusHub to nowoczesna platforma e-commerce umożliwiająca użytkownikom przeglądanie, filtrowanie i zakup produktów.

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

3. **Instalacja zależności:**
   ```
   $ npm install
   $ npx prisma generate
   $ npx prisma migrate deploy
   $ tsx prisma/seed.ts lub npm run seed
   ```
4. **Konfiguracja środowiska:**
   Stwórz w głównym katalogu projektu plik .env i dodaj:

   ```
   DATABASE_URL=
   NEXTAUTH_URL=
   NEXTAUTH_SECRET=
   JWT_SECRET=
   STRIPE_SECRET_KEY=
   STRIPE_PUBLISHABLE_KEY=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   ```

5. **Opcja 1: Uruchamianie Aplikacji w trybie developerskim:**

```bash
      Jeżeli baza PostgreSQL jest przez docker
         $ npm run start:db
         $ npm run dev
      w przeciwnym przypadku:
         $ npm run dev
```

5. **Opcja 2: Uruchamianie Aplikacji w trybie produkcyjnym:**

```bash
    Jeżeli baza PostgreSQL jest przez docker to wystarczy
         $ npm run start:app
    w przeciwnym przypadku:
         $ npm run build
         $ npm run start
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

📌 Struktura API
API jest podzielone na osobne moduły, które obsługują różne części aplikacji:

🔑 Autoryzacja (/api/auth/)
POST /api/login/ – Logowanie użytkownika.
POST /api/register/ – Rejestracja nowego użytkownika.
GET /api/check-user/ – Pomocnicza - sprawdza, czy użytkownik istnieje w bazie jeszcze przed podaniem hasła.

🏷 Kategorie (/api/categories/)
GET /api/categories/ – Pobiera wszystkie dostępne kategorie produktów.

🛍 Produkty (/api/products/)
GET /api/products/ – Pobiera listę wszystkich produktów.
GET /api/product/{id} – Pobiera szczegóły pojedynczego produktu na podstawie id.

🔄 Rekomendacje (/api/recommendations/)
GET /api/recommendations/ – Pobiera lodowo 6 rekomendowanych produktów dla użytkownika.

🛒 Koszyk (/api/cart/)
GET /api/cart/ – Pobiera zawartość koszyka użytkownika.
POST /api/cart/ – Dodaje produkt do koszyka.
DELETE /api/cart/ – Usuwa produkt z koszyka.
POST /api/validate-checkout/ – Walidacja przed złożeniem zamówienia czy dane posiadane w localStorage nie zostały zmodyfikowane przez użytkownika (weryfikuje z tym co użytkownik posiada w koszyku)
POST /api/clear-cart/ – Usuwa z koszyka tylko te produkty po dokonaniu zakupu, które użytkownik faktycznie zakupił i które trafiły do checkout. Pozostałe produkty pozostają w koszyku.

💳 Płatności (/api/create-checkout-session/)
POST /api/create-checkout-session/ – Tworzy sesję płatności Stripe.
GET /api/session-details/ – Pobiera szczegóły sesji płatności Stripe.

🚚 Zamówienia (/api/orders/)
GET /api/orders/ – Pobiera historię zamówień użytkownika.
GET /api/orders/exists/ – Sprawdza, czy użytkownik ma aktywne zamówienie.

🔑 Profil użytkownika (/api/user-profile/)
GET /api/user-profile/ – Pobiera dane profilu użytkownika.
PATCH /api/user-profile/ – Aktualizuje dane użytkownika.

📦 Zarządzanie stanem magazynowym (/api/update-stock/)
POST /api/update-stock/ – Aktualizuje stan magazynowy produktów po zakupie.

📍 Zarządzanie adresami (/api/addresses/)
GET /api/addresses/ – Pobiera zapisane adresy użytkownika.
POST /api/addresses/ – Dodaje nowy adres.
PATCH /api/addresses/ – Aktualizuje adres użytkownika.
DELETE /api/addresses/ – Usuwa zapisany adres użytkownika.
