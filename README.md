https://github.com/beerose/supabase-realtime-math-game/assets/9019397/1154d350-eec0-4c80-a24d-fde06c76a2e6

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Notes

Postgres trigger:

```sql
CREATE OR REPLACE FUNCTION check_all_players_ready()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM results WHERE room_name = NEW.room_name AND ready = false) = 0 THEN
        UPDATE rooms SET start_time = NOW() WHERE room_name = NEW.room_name;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_all_players_ready
AFTER UPDATE ON results
FOR EACH ROW
EXECUTE FUNCTION check_all_players_ready();
```
