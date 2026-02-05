import DraggableMapSection from '@/components/sections/DraggableMapSection';

/**
 * Demo page for the Interactive Draggable Map Component
 * Navigate to /map-demo to see the component in action
 */
export default function MapDemoPage() {
  return (
    <main className="min-h-screen">
      <DraggableMapSection />

      {/* Implementation Guide */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-parisian-grey-900 mb-6">
            Hogyan használd a komponenst
          </h2>

          <div className="space-y-6 text-parisian-grey-700">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-french-blue-700">
                1. Import a komponenst
              </h3>
              <pre className="bg-parisian-grey-100 p-4 rounded-lg overflow-x-auto">
                <code>{`import DraggableMapSection from '@/components/sections/DraggableMapSection';`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-french-blue-700">
                2. Használd a komponenst
              </h3>
              <pre className="bg-parisian-grey-100 p-4 rounded-lg overflow-x-auto">
                <code>{`export default function MyPage() {
  return (
    <main>
      <DraggableMapSection />
    </main>
  );
}`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-french-blue-700">
                3. Testre szabás
              </h3>
              <p className="mb-2">
                A markerek testreszabásához szerkeszd a{' '}
                <code className="bg-parisian-grey-100 px-2 py-1 rounded">
                  components/sections/draggable-map-data.ts
                </code>{' '}
                fájlt:
              </p>
              <pre className="bg-parisian-grey-100 p-4 rounded-lg overflow-x-auto">
                <code>{`export const metroMarkers: MetroMarker[] = [
  {
    id: 'station-1',
    name: 'Louvre-Rivoli',
    description: 'Közel a Louvre Múzeumhoz',
    x: 25,  // Pozíció % (0-100)
    y: 35,  // Pozíció % (0-100)
  },
  // További markerek...
];`}</code>
              </pre>
            </div>

            <div className="border-l-4 border-french-blue-500 pl-4 bg-parisian-beige-50 p-4 rounded">
              <h3 className="text-xl font-semibold mb-2 text-french-blue-700">
                Funkciók
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>🖱️ <strong>Drag & Pan:</strong> Kattints és húzd a térképet a felfedezéshez</li>
                <li>📍 <strong>Interaktív markerek:</strong> Kattints a metróállomásokra további információkért</li>
                <li>🎯 <strong>Gyors navigáció:</strong> Kattints a legend gombokon a markerek központosításához</li>
                <li>📱 <strong>Touch-friendly:</strong> Működik érintőképernyőn is</li>
                <li>🔒 <strong>Bounds checking:</strong> A térkép nem húzható túl a látható területen</li>
                <li>✨ <strong>Smooth transitions:</strong> Animált mozgás az egér felengedésekor</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
