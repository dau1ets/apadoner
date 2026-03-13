// Все карточки и элементы меню
const cards = document.querySelectorAll('.card');
const totalSumEl = document.querySelector('.total-sum');
const orderBtn = document.getElementById('orderAllBtn');

// Ваш номер WhatsApp (без +)
const whatsappNumber = "77781188800"; // <- сюда вставь свой номер

// Функция обновления общей суммы
function updateTotal() {
  let total = 0;

  cards.forEach(card => {
    // Берём все items внутри карточки, если есть
    const items = card.querySelectorAll('.item');
    if (items.length) {
      items.forEach(item => {
        const qty = parseInt(item.querySelector('.qty').textContent);
        const price = parseInt(item.dataset.price || 0);
        total += qty * price;
      });
    } else {
      const qty = parseInt(card.querySelector('.qty').textContent);
      const price = parseInt(card.dataset.price || 0);
      total += qty * price;
    }
  });

  totalSumEl.textContent = `Жалпы: ${total} ₸`;
}

// Функция изменения количества
function changeQuantity(btn, increment) {
  const parent = btn.closest('.item, .card');
  const qtySpan = parent.querySelector('.qty');
  let qty = parseInt(qtySpan.textContent);
  qty += increment;
  if (qty < 0) qty = 0;
  qtySpan.textContent = qty;
  updateTotal();
}

// Подключаем все кнопки + и -
cards.forEach(card => {
  const increaseBtns = card.querySelectorAll('.increase');
  const decreaseBtns = card.querySelectorAll('.decrease');

  increaseBtns.forEach(btn => btn.addEventListener('click', () => changeQuantity(btn, 1)));
  decreaseBtns.forEach(btn => btn.addEventListener('click', () => changeQuantity(btn, -1)));
});

// Кнопка "Тапсырыс беру"
orderBtn.addEventListener('click', () => {
  let orderLines = [];
  let hasItems = false;

  cards.forEach(card => {
    const items = card.querySelectorAll('.item');
    if (items.length) {
      items.forEach(item => {
        const qty = parseInt(item.querySelector('.qty').textContent);
        if (qty > 0) {
          const name = item.querySelector('span').textContent;
          const price = parseInt(item.dataset.price || 0);
          orderLines.push(`${name} x${qty} = ${qty * price} ₸`);
          hasItems = true;
        }
      });
    } else {
      const qty = parseInt(card.querySelector('.qty').textContent);
      if (qty > 0) {
        const nameEl = card.querySelector('h3, span');
        const name = nameEl ? nameEl.textContent : 'Блюдо';
        const price = parseInt(card.dataset.price || 0);
        orderLines.push(`${name} x${qty} = ${qty * price} ₸`);
        hasItems = true;
      }
    }
  });

  if (!hasItems) {
    alert('Сіз ештеңе таңдамадыңыз!');
    return;
  }

  const fullOrder = orderLines.join('\n') + '\n' + totalSumEl.textContent;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullOrder)}`;
  window.open(whatsappLink, '_blank');
});