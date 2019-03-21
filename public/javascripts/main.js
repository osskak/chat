const operation = document.getElementById('operation');

const requiredList = {
    1 : ['id'],
    2 : ['page'],
    3 : ['text', 'email']
};

function setRequired() {
    const operation = document.getElementById('operation').value;
    document.getElementsByTagName('button')[0].disabled = operation === '-1';

    const list = requiredList[operation] || [];
    const form = document.forms['sandbox-form'];
    const inputs = form.getElementsByTagName('input');

    [...inputs].forEach(input => {
        input.required = list.includes(input.name);
        input.disabled = !input.required;
    });
}

operation.addEventListener('change', setRequired);

const event = new Event('change');
operation.dispatchEvent(event);