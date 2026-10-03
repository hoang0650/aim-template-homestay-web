const ROOMS = [
  {
    id: 'pine',
    name: 'Phòng Đồi Thông',
    guests: 2,
    size: 22,
    price: 650000,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80',
  },
  {
    id: 'cloud',
    name: 'Phòng Săn Mây',
    guests: 2,
    size: 26,
    price: 850000,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=80',
  },
  {
    id: 'garden',
    name: 'Phòng Vườn Hồng',
    guests: 2,
    size: 24,
    price: 720000,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=80',
  },
  {
    id: 'family',
    name: 'Phòng Gia Đình',
    guests: 4,
    size: 38,
    price: 1350000,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=80',
  },
  {
    id: 'attic',
    name: 'Gác Mái Gỗ',
    guests: 4,
    size: 34,
    price: 1150000,
    image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&q=80',
  },
];

const vnd = (n) => n.toLocaleString('vi-VN') + ' ₫';
const $ = (sel) => document.querySelector(sel);

function renderRooms(filter) {
  const list = $('#room-list');
  const rooms = filter === 'all' ? ROOMS : ROOMS.filter((r) => String(r.guests) === filter);
  list.innerHTML = rooms
    .map(
      (r) => `
      <article class="room">
        <img src="${r.image}" alt="${r.name}" loading="lazy" />
        <div class="room-body">
          <h3>${r.name}</h3>
          <p class="room-meta">${r.size} m² · tối đa ${r.guests} khách</p>
          <div class="room-foot">
            <span class="price">${vnd(r.price)} <small>/đêm</small></span>
            <button class="btn btn-sm" data-book="${r.id}">Đặt</button>
          </div>
        </div>
      </article>`
    )
    .join('');
}

function nights() {
  const a = new Date($('[name=checkin]').value);
  const b = new Date($('[name=checkout]').value);
  const n = Math.round((b - a) / 86400000);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function updateSummary() {
  const room = ROOMS.find((r) => r.id === $('#room-select').value);
  const n = nights();
  $('#summary').textContent = room && n
    ? `${n} đêm × ${vnd(room.price)} = ${vnd(n * room.price)}`
    : 'Chọn ngày để xem tổng tiền.';
}

function init() {
  renderRooms('all');

  $('#room-select').innerHTML = ROOMS.map((r) => `<option value="${r.id}">${r.name} — ${vnd(r.price)}</option>`).join('');

  const today = new Date().toISOString().slice(0, 10);
  $('[name=checkin]').min = today;
  $('[name=checkout]').min = today;

  document.querySelectorAll('.chip').forEach((chip) =>
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === chip));
      renderRooms(chip.dataset.filter);
    })
  );

  $('#room-list').addEventListener('click', (e) => {
    const id = e.target.closest('[data-book]')?.dataset.book;
    if (!id) return;
    $('#room-select').value = id;
    updateSummary();
    $('#booking').scrollIntoView({ behavior: 'smooth' });
  });

  const menu = $('.menu');
  menu.addEventListener('click', () => {
    const open = $('.links').classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.links a').forEach((a) => a.addEventListener('click', () => $('.links').classList.remove('open')));

  const form = $('#booking-form');
  form.addEventListener('input', updateSummary);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = $('#form-msg');
    form.querySelectorAll('input').forEach((i) => i.classList.add('touched'));
    if (!form.checkValidity()) {
      msg.className = 'msg err';
      msg.textContent = 'Vui lòng điền đủ họ tên, số điện thoại và ngày ở.';
      return;
    }
    if (!nights()) {
      msg.className = 'msg err';
      msg.textContent = 'Ngày trả phòng phải sau ngày nhận phòng.';
      return;
    }
    const name = new FormData(form).get('name');
    msg.className = 'msg ok';
    msg.textContent = `Cảm ơn ${name}! Chúng tôi sẽ gọi xác nhận trong 15 phút.`;
    form.reset();
    updateSummary();
  });
}

document.addEventListener('DOMContentLoaded', init);
