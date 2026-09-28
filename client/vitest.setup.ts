// Vitest global setup — runs before every test file collects.
//
// env.ts validates VITE_CLERK_PUBLISHABLE_KEY at module load time and throws
// when it is missing. Every test file that (transitively) imports the app
// crashes during collection without this stub. Real production keys are
// injected via CI env; this stub only exists so unit tests can bootstrap.
import { vi } from 'vitest';

vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', 'pk_test_stub_for_unit_tests');
