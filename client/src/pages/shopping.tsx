import { useState } from 'react';
import { useLocation } from 'wouter';
import { useDashboardStore } from '@/lib/stores/dashboardStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const categories = [
  { id: 'verduras', name: 'Verduras y Hortalizas', icon: '🥬' },
  { id: 'frutas', name: 'Frutas', icon: '🍎' },
  { id: 'carnes', name: 'Carnes', icon: '🥩' },
  { id: 'pescados', name: 'Pescados', icon: '🐟' },
  { id: 'lacteos', name: 'Lácteos', icon: '🥛' },
  { id: 'panaderia', name: 'Panadería', icon: '🍞' },
  { id: 'despensa', name: 'Despensa', icon: '🥫' },
  { id: 'congelados', name: 'Congelados', icon: '🧊' },
];

const sampleItems = [
  { id: '1', name: 'Tomates', quantity: '1 kg', category: 'verduras', checked: false },
  { id: '2', name: 'Cebolla', quantity: '500 g', category: 'verduras', checked: false },
  { id: '3', name: 'Pimiento rojo', quantity: '2 unidades', category: 'verduras', checked: true },
  { id: '4', name: 'Ajo', quantity: '1 cabeza', category: 'verduras', checked: false },
  { id: '5', name: 'Lechuga', quantity: '1 unidad', category: 'verduras', checked: false },
  { id: '6', name: 'Manzanas', quantity: '1 kg', category: 'frutas', checked: false },
  { id: '7', name: 'Plátanos', quantity: '6 unidades', category: 'frutas', checked: false },
  { id: '8', name: 'Naranjas', quantity: '2 kg', category: 'frutas', checked: true },
  { id: '9', name: 'Pechuga de pollo', quantity: '500 g', category: 'carnes', checked: false },
  { id: '10', name: 'Carne picada', quantity: '400 g', category: 'carnes', checked: false },
  { id: '11', name: 'Salmón fresco', quantity: '300 g', category: 'pescados', checked: false },
  { id: '12', name: 'Leche', quantity: '2 litros', category: 'lacteos', checked: false },
  { id: '13', name: 'Yogur natural', quantity: '4 unidades', category: 'lacteos', checked: false },
  { id: '14', name: 'Queso rallado', quantity: '200 g', category: 'lacteos', checked: true },
  { id: '15', name: 'Pan de molde', quantity: '1 paquete', category: 'panaderia', checked: false },
  { id: '16', name: 'Arroz', quantity: '1 kg', category: 'despensa', checked: false },
  { id: '17', name: 'Pasta', quantity: '500 g', category: 'despensa', checked: false },
  { id: '18', name: 'Aceite de oliva', quantity: '1 litro', category: 'despensa', checked: false },
  { id: '19', name: 'Guisantes congelados', quantity: '400 g', category: 'congelados', checked: false },
];

type FilterType = 'todos' | 'pendientes' | 'comprados';

export default function ShoppingPage() {
  const [, setLocation] = useLocation();
  const [items, setItems] = useState(sampleItems);
  const [filter, setFilter] = useState<FilterType>('todos');
  const [showAddInput, setShowAddInput] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [activeNav, setActiveNav] = useState('shopping');

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (date: Date) => date.getDate();
  const monthName = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][today.getMonth()];

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const addItem = () => {
    if (newItemName.trim()) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: newItemName.trim(),
          quantity: '1 unidad',
          category: 'despensa',
          checked: false,
        }
      ]);
      setNewItemName('');
      setShowAddInput(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'pendientes') return !item.checked;
    if (filter === 'comprados') return item.checked;
    return true;
  });

  const getItemsByCategory = (categoryId: string) => {
    const categoryItems = filteredItems.filter(item => item.category === categoryId);
    return categoryItems.sort((a, b) => Number(a.checked) - Number(b.checked));
  };

  const totalItems = items.length;
  const pendingItems = items.filter(i => !i.checked).length;
  const estimatedTotal = 45;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setLocation('/dashboard')}
              className="text-gray-400 hover:text-white"
              data-testid="button-back"
            >
              ← Volver
            </button>
            <button
              className="text-accent-green hover:underline flex items-center gap-1"
              data-testid="button-share"
            >
              📤 Compartir
            </button>
          </div>
          <h1 className="text-2xl text-chalk">Lista de Compra</h1>
          <p className="text-gray-400 text-sm">
            Semana del {formatDate(weekStart)}-{formatDate(weekEnd)} {monthName}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
        <section className="card-tcf">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-accent-green">~{estimatedTotal}€</div>
              <div className="text-xs text-gray-400">Total estimado</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalItems}</div>
              <div className="text-xs text-gray-400">productos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{pendingItems}</div>
              <div className="text-xs text-gray-400">pendientes</div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-xs text-gray-400 mb-2">Comparar precios en:</p>
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors" data-testid="store-carrefour">
                🛒 Carrefour
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors" data-testid="store-mercadona">
                🛒 Mercadona
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors" data-testid="store-dia">
                🛒 DIA
              </button>
            </div>
          </div>
        </section>

        <div className="flex gap-2">
          {(['todos', 'pendientes', 'comprados'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-accent-green text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              data-testid={`filter-${f}`}
            >
              {f}
            </button>
          ))}
        </div>

        <Accordion type="multiple" defaultValue={['verduras']} className="space-y-2">
          {categories.map((category) => {
            const categoryItems = getItemsByCategory(category.id);
            if (categoryItems.length === 0) return null;
            const completedCount = categoryItems.filter(i => i.checked).length;

            return (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border border-white/10 rounded-xl overflow-hidden bg-white/5"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-white/5 [&[data-state=open]>div>.chevron]:rotate-180">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium text-white">{category.name}</span>
                    <span className="ml-auto mr-4 text-sm text-gray-400">
                      {completedCount}/{categoryItems.length}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          item.checked ? 'bg-white/5 opacity-60' : 'bg-white/10'
                        }`}
                        data-testid={`item-${item.id}`}
                      >
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="border-white/50 data-[state=checked]:bg-accent-green data-[state=checked]:border-accent-green"
                        />
                        <label
                          htmlFor={item.id}
                          className={`flex-1 cursor-pointer ${
                            item.checked ? 'line-through text-gray-500' : 'text-white'
                          }`}
                        >
                          {item.name}
                        </label>
                        <span className="text-sm text-gray-400">{item.quantity}</span>
                        {!item.checked && (
                          <button
                            className="text-xs text-accent-green hover:underline"
                            data-testid={`alt-${item.id}`}
                          >
                            Alt.
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {showAddInput ? (
          <div className="card-tcf">
            <p className="text-sm text-gray-400 mb-2">Añadir producto:</p>
            <div className="flex gap-2">
              <Input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                placeholder="Nombre del producto"
                className="flex-1 bg-white/10 border-white/20 text-white"
                autoFocus
                data-testid="input-new-item"
              />
              <Button onClick={addItem} className="bg-accent-green hover:bg-accent-green/80" data-testid="button-add-confirm">
                Añadir
              </Button>
              <Button variant="outline" onClick={() => setShowAddInput(false)} data-testid="button-add-cancel">
                ✕
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setShowAddInput(true)}
              className="p-4 rounded-xl border border-dashed border-white/30 text-gray-400 hover:border-accent-green hover:text-accent-green transition-colors flex items-center justify-center gap-2"
              data-testid="button-add-manual"
            >
              ➕ Añadir producto
            </button>
            <button
              className="p-4 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              data-testid="button-export-pdf"
            >
              📄 Exportar PDF
            </button>
            <button
              className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
              data-testid="button-whatsapp"
            >
              💬 WhatsApp
            </button>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-white/10 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {[
              { id: 'home', icon: '🏠', label: 'Inicio', path: '/dashboard' },
              { id: 'menu', icon: '📅', label: 'Menú', path: '/menu' },
              { id: 'shopping', icon: '🛒', label: 'Compra', path: '/shopping' },
              { id: 'profile', icon: '👤', label: 'Perfil', path: '/profile' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setLocation(item.path);
                }}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                  activeNav === item.id
                    ? 'text-accent-green'
                    : 'text-gray-500 hover:text-white'
                }`}
                data-testid={`nav-${item.id}`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
