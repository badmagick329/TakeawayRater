
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.50.1 */

    function create_fragment$d(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.50.1 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$5, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const sortBy = writable("rating");
    const searchFilters = writable(["tags", "foods"]);
    const searchQuery = writable("");

    function title(text) {
        
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function sortOrders(orders, sortBy) {
        if (orders.length > 1) {
            if (sortBy == "date") {
                orders.sort((a,b) => {
                    return new Date(b.order_date) - new Date(a.order_date);
                });
                return orders;
            } else if (sortBy == "rating") {
                orders.sort((a,b) => {
                    let aRating = 0;
                    let bRating = 0;
                    a.foods.forEach(food => {
                        aRating += food.rating;
                    });
                    b.foods.forEach(food => {
                        bRating += food.rating;
                    });
                    let avgARating = aRating / a.foods.length;
                    let avgBRating = bRating / b.foods.length;
                    return avgBRating - avgARating;
                });
                return orders;
            }
        }
        return orders;
    }

    function getUniqueOrders(orders) {
        let uniqueOrders = [];
        for (let order of orders) {
            let addedOrder = uniqueOrders.filter((o) => o.id === order.id);
            if (addedOrder.length > 0) {
                addedOrder = addedOrder[0];
                for (const food of order.foods) {
                    if (!addedOrder.foods.includes(food)) {
                        addedOrder.foods.push(food);
                    }
                }
            } else {
                uniqueOrders.push(order);
            }
        }
        return uniqueOrders;
    }

    function filterOrders(orders, search, tags, foods, restaurants, ownOnly, sortBy) {
        let filteredOrders = [];
        let ordersList = [];
        if (ownOnly) {
            ordersList = orders.filter(order => order.ordered_by === undefined || order.ordered_by === "You");
        } else {
            ordersList = orders;
        }

        if (search.trim() === "") {
            return sortOrders(ordersList, sortBy);
        }
        search = search.toLowerCase().trim();

        for (let order of ordersList) {
            if (restaurants) {
                if (order.restaurant.toLowerCase().includes(search)) {
                    filteredOrders.push(order);
                }
            }
            if (foods) {
                let filteredFoods = [];
                for (let food of order.foods) {
                    if (food.name.toLowerCase().includes(search)) {
                        filteredFoods.push(food);
                    }
                }
                if (filteredFoods.length > 0) {
                    filteredOrders.push({
                        ...order,
                        foods: filteredFoods
                    });
                }
            }
            if (tags) {
                let filteredFoods = [];
                for (let food of order.foods) {
                    for (let tag of food.tags) {
                        if (tag.toLowerCase().includes(search)) {
                            filteredFoods.push(food);
                        }
                    }
                }
                if (filteredFoods.length > 0) {
                    filteredOrders.push({
                        ...order,
                        foods: filteredFoods
                    });
                }
            }

        }
        return sortOrders(getUniqueOrders(filteredOrders), sortBy);
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    /* src\comps\SearchBar.svelte generated by Svelte v3.50.1 */
    const file$b = "src\\comps\\SearchBar.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (12:12) {#each searchFiltersOptions as searchFilter}
    function create_each_block$8(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1_value = title(/*searchFilter*/ ctx[6]) + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", "searchFilters");
    			input.__value = /*searchFilter*/ ctx[6];
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[5][0].push(input);
    			add_location(input, file$b, 13, 20, 511);
    			add_location(span, file$b, 14, 20, 627);
    			attr_dev(label, "class", "svelte-168lpbt");
    			add_location(label, file$b, 12, 16, 482);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = ~/*$searchFilters*/ ctx[1].indexOf(input.__value);
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$searchFilters*/ 2) {
    				input.checked = ~/*$searchFilters*/ ctx[1].indexOf(input.__value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[5][0].splice(/*$$binding_groups*/ ctx[5][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(12:12) {#each searchFiltersOptions as searchFilter}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div3;
    	let div0;
    	let input;
    	let t;
    	let div2;
    	let div1;
    	let mounted;
    	let dispose;
    	let each_value = /*searchFiltersOptions*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search");
    			attr_dev(input, "class", "svelte-168lpbt");
    			add_location(input, file$b, 7, 8, 260);
    			attr_dev(div0, "class", "search__box svelte-168lpbt");
    			add_location(div0, file$b, 6, 4, 225);
    			attr_dev(div1, "class", "filters svelte-168lpbt");
    			add_location(div1, file$b, 10, 8, 385);
    			attr_dev(div2, "class", "search__options svelte-168lpbt");
    			add_location(div2, file$b, 9, 4, 346);
    			attr_dev(div3, "class", "search svelte-168lpbt");
    			add_location(div3, file$b, 5, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*$searchQuery*/ ctx[0]);
    			append_dev(div3, t);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$searchQuery*/ 1 && input.value !== /*$searchQuery*/ ctx[0]) {
    				set_input_value(input, /*$searchQuery*/ ctx[0]);
    			}

    			if (dirty & /*title, searchFiltersOptions, $searchFilters*/ 6) {
    				each_value = /*searchFiltersOptions*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $searchQuery;
    	let $searchFilters;
    	validate_store(searchQuery, 'searchQuery');
    	component_subscribe($$self, searchQuery, $$value => $$invalidate(0, $searchQuery = $$value));
    	validate_store(searchFilters, 'searchFilters');
    	component_subscribe($$self, searchFilters, $$value => $$invalidate(1, $searchFilters = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchBar', slots, []);
    	let searchFiltersOptions = ["tags", "foods", "restaurants", "my orders"];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchBar> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_input_handler() {
    		$searchQuery = this.value;
    		searchQuery.set($searchQuery);
    	}

    	function input_change_handler() {
    		$searchFilters = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		searchFilters.set($searchFilters);
    	}

    	$$self.$capture_state = () => ({
    		searchFilters,
    		searchQuery,
    		title,
    		searchFiltersOptions,
    		$searchQuery,
    		$searchFilters
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchFiltersOptions' in $$props) $$invalidate(2, searchFiltersOptions = $$props.searchFiltersOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		$searchQuery,
    		$searchFilters,
    		searchFiltersOptions,
    		input_input_handler,
    		input_change_handler,
    		$$binding_groups
    	];
    }

    class SearchBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchBar",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    const containerWidth = 340;
    const missingImage = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Comic_image_missing.svg";

    /* src\comps\ActionBar.svelte generated by Svelte v3.50.1 */
    const file$a = "src\\comps\\ActionBar.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (13:8) {#each sortByOptions as sort}
    function create_each_block$7(ctx) {
    	let option;
    	let t0;
    	let t1_value = title(/*sort*/ ctx[5]) + "";
    	let t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text("Sort by ");
    			t1 = text(t1_value);
    			option.__value = /*sort*/ ctx[5];
    			option.value = option.__value;
    			add_location(option, file$a, 13, 12, 534);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(13:8) {#each sortByOptions as sort}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let button;
    	let t1;
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*sortByOptions*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Add Order";
    			t1 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button, "class", "actionbar__add");
    			add_location(button, file$a, 10, 4, 298);
    			attr_dev(select, "class", "text-size--small");
    			set_style(select, "border-radius", "4px");
    			if (/*$sortBy*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[4].call(select));
    			add_location(select, file$a, 11, 4, 399);
    			attr_dev(div, "class", "actionbar svelte-bfsyse");
    			set_style(div, "width", containerWidth + "px");
    			add_location(div, file$a, 9, 0, 235);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t1);
    			append_dev(div, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*$sortBy*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[4])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sortByOptions, title*/ 4) {
    				each_value = /*sortByOptions*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$sortBy, sortByOptions*/ 6) {
    				select_option(select, /*$sortBy*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $sortBy;
    	validate_store(sortBy, 'sortBy');
    	component_subscribe($$self, sortBy, $$value => $$invalidate(1, $sortBy = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ActionBar', slots, []);
    	let { showOrderNew } = $$props;
    	let sortByOptions = ["rating", "date"];
    	const writable_props = ['showOrderNew'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ActionBar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, showOrderNew = !showOrderNew);

    	function select_change_handler() {
    		$sortBy = select_value(this);
    		sortBy.set($sortBy);
    		$$invalidate(2, sortByOptions);
    	}

    	$$self.$$set = $$props => {
    		if ('showOrderNew' in $$props) $$invalidate(0, showOrderNew = $$props.showOrderNew);
    	};

    	$$self.$capture_state = () => ({
    		sortBy,
    		title,
    		containerWidth,
    		showOrderNew,
    		sortByOptions,
    		$sortBy
    	});

    	$$self.$inject_state = $$props => {
    		if ('showOrderNew' in $$props) $$invalidate(0, showOrderNew = $$props.showOrderNew);
    		if ('sortByOptions' in $$props) $$invalidate(2, sortByOptions = $$props.sortByOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showOrderNew, $sortBy, sortByOptions, click_handler, select_change_handler];
    }

    class ActionBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { showOrderNew: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActionBar",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*showOrderNew*/ ctx[0] === undefined && !('showOrderNew' in props)) {
    			console.warn("<ActionBar> was created without expected prop 'showOrderNew'");
    		}
    	}

    	get showOrderNew() {
    		throw new Error("<ActionBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showOrderNew(value) {
    		throw new Error("<ActionBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\comps\order\Tags.svelte generated by Svelte v3.50.1 */

    const file$9 = "src\\comps\\order\\Tags.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (5:4) {#each tags as tag}
    function create_each_block$6(ctx) {
    	let span;
    	let t_value = /*tag*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "text-size--small svelte-1xovoen");
    			add_location(span, file$9, 5, 8, 96);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tags*/ 1 && t_value !== (t_value = /*tag*/ ctx[1] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(5:4) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let each_value = /*tags*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "tags svelte-1xovoen");
    			add_location(div, file$9, 3, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tags*/ 1) {
    				each_value = /*tags*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tags', slots, []);
    	let { tags } = $$props;
    	const writable_props = ['tags'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tags> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('tags' in $$props) $$invalidate(0, tags = $$props.tags);
    	};

    	$$self.$capture_state = () => ({ tags });

    	$$self.$inject_state = $$props => {
    		if ('tags' in $$props) $$invalidate(0, tags = $$props.tags);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tags];
    }

    class Tags extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { tags: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tags",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tags*/ ctx[0] === undefined && !('tags' in props)) {
    			console.warn("<Tags> was created without expected prop 'tags'");
    		}
    	}

    	get tags() {
    		throw new Error("<Tags>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tags(value) {
    		throw new Error("<Tags>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\comps\order\Rating.svelte generated by Svelte v3.50.1 */

    const file$8 = "src\\comps\\order\\Rating.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (12:8) {:else}
    function create_else_block$4(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "⭐\r\n        ";
    			attr_dev(span, "class", "star svelte-16howx9");
    			toggle_class(span, "inactive", /*rating*/ ctx[0] < /*star*/ ctx[4]);
    			add_location(span, file$8, 12, 8, 406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rating, ratingArray*/ 5) {
    				toggle_class(span, "inactive", /*rating*/ ctx[0] < /*star*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(12:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:8) {#if allowInput}
    function create_if_block$6(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*star*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "⭐\r\n        ";
    			attr_dev(span, "class", "star-input svelte-16howx9");
    			toggle_class(span, "inactive", /*rating*/ ctx[0] < /*star*/ ctx[4]);
    			add_location(span, file$8, 8, 8, 260);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*rating, ratingArray*/ 5) {
    				toggle_class(span, "inactive", /*rating*/ ctx[0] < /*star*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(8:8) {#if allowInput}",
    		ctx
    	});

    	return block;
    }

    // (7:4) {#each ratingArray as star}
    function create_each_block$5(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*allowInput*/ ctx[1]) return create_if_block$6;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(7:4) {#each ratingArray as star}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let div_style_value;
    	let each_value = /*ratingArray*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "stars svelte-16howx9");
    			attr_dev(div, "style", div_style_value = /*allowInput*/ ctx[1] ? "justify-content: center" : "");
    			add_location(div, file$8, 5, 0, 120);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*rating, ratingArray, allowInput*/ 7) {
    				each_value = /*ratingArray*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*allowInput*/ 2 && div_style_value !== (div_style_value = /*allowInput*/ ctx[1] ? "justify-content: center" : "")) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Rating', slots, []);
    	let { rating = 3 } = $$props;
    	let { allowInput = true } = $$props;
    	let ratingArray = [1, 2, 3, 4, 5];
    	const writable_props = ['rating', 'allowInput'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Rating> was created with unknown prop '${key}'`);
    	});

    	const click_handler = star => $$invalidate(0, rating = star);

    	$$self.$$set = $$props => {
    		if ('rating' in $$props) $$invalidate(0, rating = $$props.rating);
    		if ('allowInput' in $$props) $$invalidate(1, allowInput = $$props.allowInput);
    	};

    	$$self.$capture_state = () => ({ rating, allowInput, ratingArray });

    	$$self.$inject_state = $$props => {
    		if ('rating' in $$props) $$invalidate(0, rating = $$props.rating);
    		if ('allowInput' in $$props) $$invalidate(1, allowInput = $$props.allowInput);
    		if ('ratingArray' in $$props) $$invalidate(2, ratingArray = $$props.ratingArray);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [rating, allowInput, ratingArray, click_handler];
    }

    class Rating extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { rating: 0, allowInput: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Rating",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get rating() {
    		throw new Error("<Rating>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rating(value) {
    		throw new Error("<Rating>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allowInput() {
    		throw new Error("<Rating>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allowInput(value) {
    		throw new Error("<Rating>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\comps\order\Food.svelte generated by Svelte v3.50.1 */
    const file$7 = "src\\comps\\order\\Food.svelte";

    // (19:12) {:else}
    function create_else_block$3(ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*food*/ ctx[0].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*food*/ ctx[0].name);
    			attr_dev(img, "width", "100");
    			attr_dev(img, "class", "svelte-hmu5la");
    			add_location(img, file$7, 19, 53, 771);
    			attr_dev(a, "href", a_href_value = /*food*/ ctx[0].image);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$7, 19, 16, 734);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*food*/ 1 && !src_url_equal(img.src, img_src_value = /*food*/ ctx[0].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*food*/ 1 && img_alt_value !== (img_alt_value = /*food*/ ctx[0].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*food*/ 1 && a_href_value !== (a_href_value = /*food*/ ctx[0].image)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(19:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:12) {#if food.image === missingImage && food.image_url}
    function create_if_block_1$4(ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*food*/ ctx[0].image_url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*food*/ ctx[0].name);
    			attr_dev(img, "width", "100");
    			attr_dev(img, "class", "svelte-hmu5la");
    			add_location(img, file$7, 17, 57, 638);
    			attr_dev(a, "href", a_href_value = /*food*/ ctx[0].image_url);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$7, 17, 16, 597);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*food*/ 1 && !src_url_equal(img.src, img_src_value = /*food*/ ctx[0].image_url)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*food*/ 1 && img_alt_value !== (img_alt_value = /*food*/ ctx[0].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*food*/ 1 && a_href_value !== (a_href_value = /*food*/ ctx[0].image_url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(17:12) {#if food.image === missingImage && food.image_url}",
    		ctx
    	});

    	return block;
    }

    // (24:4) {#if food.comment}
    function create_if_block$5(ctx) {
    	let div;
    	let span;
    	let t_value = /*food*/ ctx[0].comment + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$7, 25, 12, 946);
    			attr_dev(div, "class", "food__comment svelte-hmu5la");
    			add_location(div, file$7, 24, 8, 905);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*food*/ 1 && t_value !== (t_value = /*food*/ ctx[0].comment + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(24:4) {#if food.comment}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let span0;
    	let t0_value = title(/*food*/ ctx[0].name) + "";
    	let t0;
    	let t1;
    	let span1;
    	let rating;
    	let t2;
    	let span2;
    	let tags;
    	let t3;
    	let div1;
    	let t4;
    	let current;

    	rating = new Rating({
    			props: {
    				rating: /*food*/ ctx[0].rating,
    				allowInput: false
    			},
    			$$inline: true
    		});

    	tags = new Tags({
    			props: { tags: /*food*/ ctx[0].tags },
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (/*food*/ ctx[0].image === missingImage && /*food*/ ctx[0].image_url) return create_if_block_1$4;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*food*/ ctx[0].comment && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			create_component(rating.$$.fragment);
    			t2 = space();
    			span2 = element("span");
    			create_component(tags.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(span0, "class", "svelte-hmu5la");
    			add_location(span0, file$7, 11, 12, 309);
    			attr_dev(span1, "class", "svelte-hmu5la");
    			add_location(span1, file$7, 12, 12, 354);
    			attr_dev(span2, "class", "svelte-hmu5la");
    			add_location(span2, file$7, 13, 12, 431);
    			attr_dev(div0, "class", "left svelte-hmu5la");
    			add_location(div0, file$7, 10, 8, 277);
    			attr_dev(div1, "class", "right svelte-hmu5la");
    			add_location(div1, file$7, 15, 8, 495);
    			attr_dev(div2, "class", "food__header svelte-hmu5la");
    			add_location(div2, file$7, 9, 4, 241);
    			attr_dev(div3, "class", "food svelte-hmu5la");
    			add_location(div3, file$7, 8, 0, 217);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			mount_component(rating, span1, null);
    			append_dev(div0, t2);
    			append_dev(div0, span2);
    			mount_component(tags, span2, null);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			if_block0.m(div1, null);
    			append_dev(div3, t4);
    			if (if_block1) if_block1.m(div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*food*/ 1) && t0_value !== (t0_value = title(/*food*/ ctx[0].name) + "")) set_data_dev(t0, t0_value);
    			const rating_changes = {};
    			if (dirty & /*food*/ 1) rating_changes.rating = /*food*/ ctx[0].rating;
    			rating.$set(rating_changes);
    			const tags_changes = {};
    			if (dirty & /*food*/ 1) tags_changes.tags = /*food*/ ctx[0].tags;
    			tags.$set(tags_changes);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			}

    			if (/*food*/ ctx[0].comment) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(div3, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rating.$$.fragment, local);
    			transition_in(tags.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rating.$$.fragment, local);
    			transition_out(tags.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(rating);
    			destroy_component(tags);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Food', slots, []);
    	let { food } = $$props;
    	const writable_props = ['food'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Food> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('food' in $$props) $$invalidate(0, food = $$props.food);
    	};

    	$$self.$capture_state = () => ({ Tags, Rating, title, missingImage, food });

    	$$self.$inject_state = $$props => {
    		if ('food' in $$props) $$invalidate(0, food = $$props.food);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [food];
    }

    class Food extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { food: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Food",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*food*/ ctx[0] === undefined && !('food' in props)) {
    			console.warn("<Food> was created without expected prop 'food'");
    		}
    	}

    	get food() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set food(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\comps\order\OrderEdit.svelte generated by Svelte v3.50.1 */

    const { console: console_1 } = globals;
    const file$6 = "src\\comps\\order\\OrderEdit.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[23] = list;
    	child_ctx[24] = i;
    	return child_ctx;
    }

    // (255:16) {#if order.foods[i].tags.length > 0}
    function create_if_block_3$2(ctx) {
    	let tags;
    	let current;

    	tags = new Tags({
    			props: {
    				tags: /*order*/ ctx[0].foods[/*i*/ ctx[24]].tags
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tags.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tags, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tags_changes = {};
    			if (dirty & /*order*/ 1) tags_changes.tags = /*order*/ ctx[0].foods[/*i*/ ctx[24]].tags;
    			tags.$set(tags_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tags.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tags.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tags, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(255:16) {#if order.foods[i].tags.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (271:50) 
    function create_if_block_2$3(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "preview-image svelte-cbp51x");
    			if (!src_url_equal(img.src, img_src_value = /*order*/ ctx[0].foods[/*i*/ ctx[24]].imageUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*order*/ ctx[0].foods[/*i*/ ctx[24]].name);
    			add_location(img, file$6, 271, 20, 9295);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*order*/ 1 && !src_url_equal(img.src, img_src_value = /*order*/ ctx[0].foods[/*i*/ ctx[24]].imageUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*order*/ 1 && img_alt_value !== (img_alt_value = /*order*/ ctx[0].foods[/*i*/ ctx[24]].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(271:50) ",
    		ctx
    	});

    	return block;
    }

    // (269:16) {#if previews[i]}
    function create_if_block_1$3(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "preview-image svelte-cbp51x");
    			if (!src_url_equal(img.src, img_src_value = /*previews*/ ctx[1][/*i*/ ctx[24]])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*order*/ ctx[0].foods[/*i*/ ctx[24]].name);
    			add_location(img, file$6, 269, 20, 9148);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*previews*/ 2 && !src_url_equal(img.src, img_src_value = /*previews*/ ctx[1][/*i*/ ctx[24]])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*order*/ 1 && img_alt_value !== (img_alt_value = /*order*/ ctx[0].foods[/*i*/ ctx[24]].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(269:16) {#if previews[i]}",
    		ctx
    	});

    	return block;
    }

    // (244:8) {#each order.foods as food, i}
    function create_each_block$4(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t0_value = /*errors*/ ctx[2].foods[/*i*/ ctx[24]] + "";
    	let t0;
    	let div0_style_value;
    	let t1;
    	let input0;
    	let t2;
    	let div2;
    	let input1;
    	let t3;
    	let div3;
    	let t4;
    	let div4;
    	let input2;
    	let t5;
    	let div5;
    	let rating;
    	let updating_rating;
    	let t6;
    	let div6;
    	let input3;
    	let t7;
    	let input4;
    	let t8;
    	let t9;
    	let current;
    	let mounted;
    	let dispose;

    	function input0_input_handler_1() {
    		/*input0_input_handler_1*/ ctx[13].call(input0, /*i*/ ctx[24]);
    	}

    	function input1_input_handler_1() {
    		/*input1_input_handler_1*/ ctx[14].call(input1, /*i*/ ctx[24]);
    	}

    	let if_block0 = /*order*/ ctx[0].foods[/*i*/ ctx[24]].tags.length > 0 && create_if_block_3$2(ctx);

    	function input2_input_handler() {
    		/*input2_input_handler*/ ctx[15].call(input2, /*i*/ ctx[24]);
    	}

    	function rating_rating_binding(value) {
    		/*rating_rating_binding*/ ctx[16](value, /*i*/ ctx[24]);
    	}

    	let rating_props = {};

    	if (/*order*/ ctx[0].foods[/*i*/ ctx[24]].rating !== void 0) {
    		rating_props.rating = /*order*/ ctx[0].foods[/*i*/ ctx[24]].rating;
    	}

    	rating = new Rating({ props: rating_props, $$inline: true });
    	binding_callbacks.push(() => bind(rating, 'rating', rating_rating_binding));

    	function input_handler(...args) {
    		return /*input_handler*/ ctx[17](/*i*/ ctx[24], ...args);
    	}

    	function input4_input_handler() {
    		/*input4_input_handler*/ ctx[18].call(input4, /*i*/ ctx[24]);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*previews*/ ctx[1][/*i*/ ctx[24]]) return create_if_block_1$3;
    		if (/*order*/ ctx[0].foods[/*i*/ ctx[24]].imageUrl) return create_if_block_2$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t3 = space();
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t4 = space();
    			div4 = element("div");
    			input2 = element("input");
    			t5 = space();
    			div5 = element("div");
    			create_component(rating.$$.fragment);
    			t6 = space();
    			div6 = element("div");
    			input3 = element("input");
    			t7 = space();
    			input4 = element("input");
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			add_location(span, file$6, 246, 20, 7856);
    			attr_dev(div0, "class", "error-field svelte-cbp51x");

    			attr_dev(div0, "style", div0_style_value = /*errors*/ ctx[2].foods[/*i*/ ctx[24]]
    			? "display:block;"
    			: "display:none;");

    			add_location(div0, file$6, 245, 16, 7748);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", `food-${/*i*/ ctx[24]}`);
    			attr_dev(input0, "placeholder", "Food Name");
    			add_location(input0, file$6, 248, 16, 7928);
    			attr_dev(div1, "class", "input-field svelte-cbp51x");
    			add_location(div1, file$6, 244, 12, 7705);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", `tags-${/*i*/ ctx[24]}`);
    			attr_dev(input1, "placeholder", "Tags (Optional)");
    			add_location(input1, file$6, 251, 16, 8120);
    			attr_dev(div2, "class", "input-field svelte-cbp51x");
    			add_location(div2, file$6, 250, 12, 8077);
    			attr_dev(div3, "class", "input-display svelte-cbp51x");
    			add_location(div3, file$6, 253, 12, 8259);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", `comment-${/*i*/ ctx[24]}`);
    			attr_dev(input2, "placeholder", "Comment (Optional)");
    			add_location(input2, file$6, 259, 16, 8496);
    			attr_dev(div4, "class", "input-field svelte-cbp51x");
    			add_location(div4, file$6, 258, 12, 8453);
    			attr_dev(div5, "class", "input-field svelte-cbp51x");
    			add_location(div5, file$6, 261, 12, 8641);
    			attr_dev(input3, "class", "file-input svelte-cbp51x");
    			attr_dev(input3, "type", "file");
    			attr_dev(input3, "name", `image-${/*i*/ ctx[24]}`);
    			attr_dev(input3, "accept", "image/*");
    			add_location(input3, file$6, 265, 16, 8806);
    			attr_dev(input4, "class", "link-input svelte-cbp51x");
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "name", `image-link-${/*i*/ ctx[24]}`);
    			attr_dev(input4, "placeholder", "(Alternative) Image Link");
    			add_location(input4, file$6, 266, 16, 8933);
    			attr_dev(div6, "class", "input-field svelte-cbp51x");
    			add_location(div6, file$6, 264, 12, 8763);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t0);
    			append_dev(div1, t1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*order*/ ctx[0].foods[/*i*/ ctx[24]].name);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, input1);
    			set_input_value(input1, /*order*/ ctx[0].foods[/*i*/ ctx[24]].tagsStr);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div3, anchor);
    			if (if_block0) if_block0.m(div3, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, input2);
    			set_input_value(input2, /*order*/ ctx[0].foods[/*i*/ ctx[24]].comment);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div5, anchor);
    			mount_component(rating, div5, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, input3);
    			append_dev(div6, t7);
    			append_dev(div6, input4);
    			set_input_value(input4, /*order*/ ctx[0].foods[/*i*/ ctx[24]].imageUrl);
    			append_dev(div6, t8);
    			if (if_block1) if_block1.m(div6, null);
    			append_dev(div6, t9);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", input0_input_handler_1),
    					listen_dev(input0, "blur", /*validate*/ ctx[6], false, false, false),
    					listen_dev(input1, "input", input1_input_handler_1),
    					listen_dev(input2, "input", input2_input_handler),
    					listen_dev(input3, "input", input_handler, false, false, false),
    					listen_dev(input4, "input", input4_input_handler)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*errors*/ 4) && t0_value !== (t0_value = /*errors*/ ctx[2].foods[/*i*/ ctx[24]] + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*errors*/ 4 && div0_style_value !== (div0_style_value = /*errors*/ ctx[2].foods[/*i*/ ctx[24]]
    			? "display:block;"
    			: "display:none;")) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*order*/ 1 && input0.value !== /*order*/ ctx[0].foods[/*i*/ ctx[24]].name) {
    				set_input_value(input0, /*order*/ ctx[0].foods[/*i*/ ctx[24]].name);
    			}

    			if (dirty & /*order*/ 1 && input1.value !== /*order*/ ctx[0].foods[/*i*/ ctx[24]].tagsStr) {
    				set_input_value(input1, /*order*/ ctx[0].foods[/*i*/ ctx[24]].tagsStr);
    			}

    			if (/*order*/ ctx[0].foods[/*i*/ ctx[24]].tags.length > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*order*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div3, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*order*/ 1 && input2.value !== /*order*/ ctx[0].foods[/*i*/ ctx[24]].comment) {
    				set_input_value(input2, /*order*/ ctx[0].foods[/*i*/ ctx[24]].comment);
    			}

    			const rating_changes = {};

    			if (!updating_rating && dirty & /*order*/ 1) {
    				updating_rating = true;
    				rating_changes.rating = /*order*/ ctx[0].foods[/*i*/ ctx[24]].rating;
    				add_flush_callback(() => updating_rating = false);
    			}

    			rating.$set(rating_changes);

    			if (dirty & /*order*/ 1 && input4.value !== /*order*/ ctx[0].foods[/*i*/ ctx[24]].imageUrl) {
    				set_input_value(input4, /*order*/ ctx[0].foods[/*i*/ ctx[24]].imageUrl);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div6, t9);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(rating.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(rating.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div3);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div5);
    			destroy_component(rating);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div6);

    			if (if_block1) {
    				if_block1.d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(244:8) {#each order.foods as food, i}",
    		ctx
    	});

    	return block;
    }

    // (280:8) {#if order.foods.length > 0}
    function create_if_block$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Less Food";
    			add_location(button, file$6, 280, 12, 9592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*removeFood*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(280:8) {#if order.foods.length > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div6;
    	let div1;
    	let div0;
    	let span0;
    	let t0_value = /*errors*/ ctx[2].restaurant + "";
    	let t0;
    	let div0_style_value;
    	let t1;
    	let input0;
    	let t2;
    	let div3;
    	let div2;
    	let span1;
    	let t3_value = /*errors*/ ctx[2].url + "";
    	let t3;
    	let div2_style_value;
    	let t4;
    	let input1;
    	let t5;
    	let div4;
    	let t6;
    	let div5;
    	let button0;
    	let t8;
    	let t9;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*order*/ ctx[0].foods;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*order*/ ctx[0].foods.length > 0 && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			div5 = element("div");
    			button0 = element("button");
    			button0.textContent = "More Food";
    			t8 = space();
    			if (if_block) if_block.c();
    			t9 = space();
    			button1 = element("button");
    			button1.textContent = "Submit";
    			add_location(span0, file$6, 230, 12, 7114);
    			attr_dev(div0, "class", "error-field svelte-cbp51x");

    			attr_dev(div0, "style", div0_style_value = /*errors*/ ctx[2].restaurant
    			? "display:block;"
    			: "display:none;");

    			add_location(div0, file$6, 229, 8, 7012);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "restaurant");
    			attr_dev(input0, "placeholder", "Restaurant Name");
    			add_location(input0, file$6, 232, 8, 7172);
    			attr_dev(div1, "class", "input-field svelte-cbp51x");
    			add_location(div1, file$6, 228, 4, 6977);
    			add_location(span1, file$6, 237, 12, 7443);
    			attr_dev(div2, "class", "error-field svelte-cbp51x");

    			attr_dev(div2, "style", div2_style_value = /*errors*/ ctx[2].url
    			? "display:block;"
    			: "display:none;");

    			add_location(div2, file$6, 236, 8, 7348);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "url");
    			attr_dev(input1, "placeholder", "Restaurant URL (Optional)");
    			add_location(input1, file$6, 239, 8, 7494);
    			attr_dev(div3, "class", "input-field svelte-cbp51x");
    			add_location(div3, file$6, 235, 4, 7313);
    			attr_dev(div4, "class", "food-input svelte-cbp51x");
    			add_location(div4, file$6, 242, 4, 7627);
    			add_location(button0, file$6, 278, 8, 9495);
    			add_location(button1, file$6, 282, 8, 9665);
    			attr_dev(div5, "class", "buttons-bar svelte-cbp51x");
    			add_location(div5, file$6, 277, 4, 9460);
    			attr_dev(div6, "class", "order");
    			add_location(div6, file$6, 227, 0, 6952);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*order*/ ctx[0].restaurant);
    			append_dev(div6, t2);
    			append_dev(div6, div3);
    			append_dev(div3, div2);
    			append_dev(div2, span1);
    			append_dev(span1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, input1);
    			set_input_value(input1, /*order*/ ctx[0].url);
    			append_dev(div6, t5);
    			append_dev(div6, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			append_dev(div6, t6);
    			append_dev(div6, div5);
    			append_dev(div5, button0);
    			append_dev(div5, t8);
    			if (if_block) if_block.m(div5, null);
    			append_dev(div5, t9);
    			append_dev(div5, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input0, "blur", /*validate*/ ctx[6], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(input1, "blur", /*validate*/ ctx[6], false, false, false),
    					listen_dev(button0, "click", /*addFood*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*submitOrder*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*errors*/ 4) && t0_value !== (t0_value = /*errors*/ ctx[2].restaurant + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*errors*/ 4 && div0_style_value !== (div0_style_value = /*errors*/ ctx[2].restaurant
    			? "display:block;"
    			: "display:none;")) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*order*/ 1 && input0.value !== /*order*/ ctx[0].restaurant) {
    				set_input_value(input0, /*order*/ ctx[0].restaurant);
    			}

    			if ((!current || dirty & /*errors*/ 4) && t3_value !== (t3_value = /*errors*/ ctx[2].url + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*errors*/ 4 && div2_style_value !== (div2_style_value = /*errors*/ ctx[2].url
    			? "display:block;"
    			: "display:none;")) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (dirty & /*order*/ 1 && input1.value !== /*order*/ ctx[0].url) {
    				set_input_value(input1, /*order*/ ctx[0].url);
    			}

    			if (dirty & /*previews, order, readImage, validate, errors*/ 103) {
    				each_value = /*order*/ ctx[0].foods;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div4, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*order*/ ctx[0].foods.length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(div5, t9);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function toFormData(order, csrfToken, includeImages = false) {
    	const formData = new FormData();
    	formData.append("restaurant", order.restaurant);
    	formData.append("url", order.url);

    	if (order.id) {
    		formData.append("id", order.id);
    	}

    	order.foods.forEach((food, i) => {
    		if (food.id) {
    			formData.append(`foods-${i}-id`, food.id);
    		}

    		formData.append(`food-${i}-name`, food.name);
    		formData.append(`food-${i}-rating`, food.rating);
    		formData.append(`food-${i}-tags`, food.tags);
    		formData.append(`food-${i}-comment`, food.comment);

    		if (includeImages && food.image) {
    			formData.append(`food-${i}-image`, food.image);
    		} else if (includeImages && food.imageUrl) {
    			formData.append(`food-${i}-image-url`, food.imageUrl);
    		}
    	});

    	formData.append('csrfmiddlewaretoken', csrfToken);
    	return formData;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OrderEdit', slots, []);
    	let { showOrderNew } = $$props;
    	let { initialData = null } = $$props;
    	let { beingEdited = false } = $$props;
    	const dispatch = createEventDispatcher();

    	function refreshOrders() {
    		dispatch('refreshOrders');
    	}

    	let order;

    	if (initialData) {
    		//console.log(`initialData: ${JSON.stringify(initialData)}`);
    		order = {
    			id: initialData.id,
    			restaurant: initialData.restaurant,
    			url: initialData.url,
    			foods: initialData.foods.map(food => {
    				return {
    					id: food.id,
    					name: food.name,
    					rating: food.rating,
    					tagsStr: food.tags.join(),
    					tags: food.tags,
    					imageUrl: food.imageUrl,
    					comment: food.comment
    				};
    			})
    		};
    	} else {
    		order = { restaurant: "", url: "", foods: [] };
    	}

    	let previews = {};
    	let errors = { restaurant: "", url: "", foods: [] };

    	function addFood() {
    		order.foods.push({
    			name: "",
    			rating: 1,
    			image: null,
    			imageUrl: "",
    			tagsStr: "",
    			tags: [],
    			comment: ""
    		});

    		errors.foods.push("");
    		$$invalidate(0, order = { ...order });
    	}

    	if (order.foods.length == 0) {
    		addFood();
    	}

    	function removeFood() {
    		if (order.foods.length > 0) {
    			order.foods.pop();
    			errors.foods.pop();
    			$$invalidate(0, order = { ...order });
    		}
    	}

    	function readImage(e, i) {
    		$$invalidate(0, order.foods[i].image = e.target.files[0], order);
    		let reader = new FileReader();
    		reader.readAsDataURL(order.foods[i].image);

    		reader.onload = e => {
    			$$invalidate(1, previews[i] = e.target.result, previews);
    		};

    		$$invalidate(0, order = { ...order });
    	}

    	function displayErrors(data) {
    		if (data["errors"]["restaurant"]) {
    			$$invalidate(2, errors.restaurant = data["errors"]["restaurant"], errors);
    		}

    		if (data["errors"]["url"]) {
    			$$invalidate(2, errors.url = data["errors"]["url"], errors);
    		}

    		if (data["errors"]["foods"]) {
    			data["errors"]["foods"].forEach((food, index) => {
    				$$invalidate(2, errors.foods[index] = food, errors);
    			});
    		}
    	}

    	async function validate(e) {
    		const formData = toFormData(order, getCookie('csrftoken'));

    		const resp = await fetch('/api/validate', {
    			method: 'POST',
    			mode: 'same-origin',
    			body: formData
    		});

    		const data = await resp.json();

    		if (data["errors"]) {
    			displayErrors(data);
    		} else {
    			$$invalidate(2, errors = {
    				restaurant: "",
    				url: "",
    				foods: [...errors.foods]
    			});

    			if (data["url"]) {
    				$$invalidate(0, order.url = data["url"], order);
    				$$invalidate(0, order = { ...order });
    			}

    			if (data["foods"]) {
    				data["foods"].forEach((food, i) => {
    					if (food["rating"]) {
    						$$invalidate(0, order.foods[i].rating = food["rating"], order);
    					}

    					if (food["tags"] && order.foods[i].tagsStr.trim() == "") {
    						$$invalidate(0, order.foods[i].tagsStr = food["tags"].join(","), order);
    					}

    					if (food["image"] && !previews[i]) {
    						$$invalidate(1, previews[i] = food["image"], previews);
    					}

    					if (food["comment"] && order.foods[i].comment.trim() == "") {
    						$$invalidate(0, order.foods[i].comment = food["comment"], order);
    					}
    				});

    				$$invalidate(0, order = { ...order });
    			}

    			if (e.target.name.startsWith("food-")) {
    				const index = parseInt(e.target.name.split("-")[1]);

    				if (e.target.value.trim() === "") {
    					$$invalidate(2, errors.foods[index] = "Food name cannot be empty", errors);
    				} else {
    					$$invalidate(2, errors.foods[index] = "", errors);
    				}
    			}
    		}
    	}

    	async function submitOrder() {
    		const formData = toFormData(order, getCookie('csrftoken'), true);

    		const submitUrl = beingEdited
    		? `/api/edit-order/${initialData.id}`
    		: '/api/create-order';

    		const resp = await fetch(submitUrl, {
    			method: 'POST',
    			mode: 'same-origin',
    			body: formData
    		});

    		const data = await resp.json();

    		if (data["errors"]) {
    			displayErrors(data);
    		} else if (data["success"]) {
    			$$invalidate(2, errors = { restaurant: "", url: "", foods: [] });
    			$$invalidate(0, order = { restaurant: "", url: "", foods: [] });
    			$$invalidate(1, previews = {});

    			document.querySelectorAll('.file-input').forEach(input => {
    				input.value = "";
    			});

    			$$invalidate(8, showOrderNew = false);
    			$$invalidate(9, beingEdited = false);
    			refreshOrders();
    		}
    	}

    	const writable_props = ['showOrderNew', 'initialData', 'beingEdited'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<OrderEdit> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		order.restaurant = this.value;
    		$$invalidate(0, order);
    	}

    	function input1_input_handler() {
    		order.url = this.value;
    		$$invalidate(0, order);
    	}

    	function input0_input_handler_1(i) {
    		order.foods[i].name = this.value;
    		$$invalidate(0, order);
    	}

    	function input1_input_handler_1(i) {
    		order.foods[i].tagsStr = this.value;
    		$$invalidate(0, order);
    	}

    	function input2_input_handler(i) {
    		order.foods[i].comment = this.value;
    		$$invalidate(0, order);
    	}

    	function rating_rating_binding(value, i) {
    		if ($$self.$$.not_equal(order.foods[i].rating, value)) {
    			order.foods[i].rating = value;
    			$$invalidate(0, order);
    		}
    	}

    	const input_handler = (i, e) => readImage(e, i);

    	function input4_input_handler(i) {
    		order.foods[i].imageUrl = this.value;
    		$$invalidate(0, order);
    	}

    	$$self.$$set = $$props => {
    		if ('showOrderNew' in $$props) $$invalidate(8, showOrderNew = $$props.showOrderNew);
    		if ('initialData' in $$props) $$invalidate(10, initialData = $$props.initialData);
    		if ('beingEdited' in $$props) $$invalidate(9, beingEdited = $$props.beingEdited);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Rating,
    		Tags,
    		getCookie,
    		showOrderNew,
    		initialData,
    		beingEdited,
    		dispatch,
    		refreshOrders,
    		order,
    		toFormData,
    		previews,
    		errors,
    		addFood,
    		removeFood,
    		readImage,
    		displayErrors,
    		validate,
    		submitOrder
    	});

    	$$self.$inject_state = $$props => {
    		if ('showOrderNew' in $$props) $$invalidate(8, showOrderNew = $$props.showOrderNew);
    		if ('initialData' in $$props) $$invalidate(10, initialData = $$props.initialData);
    		if ('beingEdited' in $$props) $$invalidate(9, beingEdited = $$props.beingEdited);
    		if ('order' in $$props) $$invalidate(0, order = $$props.order);
    		if ('previews' in $$props) $$invalidate(1, previews = $$props.previews);
    		if ('errors' in $$props) $$invalidate(2, errors = $$props.errors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*order*/ 1) {
    			{
    				order.foods.forEach(food => {
    					console.log(`food: ${JSON.stringify(food)}`);
    					food.tags = [];

    					food.tagsStr.split(",").forEach(tag => {
    						if (tag.trim() != "") {
    							food.tags.push(tag.trim().toLowerCase());
    						}
    					});
    				});
    			}
    		}
    	};

    	return [
    		order,
    		previews,
    		errors,
    		addFood,
    		removeFood,
    		readImage,
    		validate,
    		submitOrder,
    		showOrderNew,
    		beingEdited,
    		initialData,
    		input0_input_handler,
    		input1_input_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		rating_rating_binding,
    		input_handler,
    		input4_input_handler
    	];
    }

    class OrderEdit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			showOrderNew: 8,
    			initialData: 10,
    			beingEdited: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OrderEdit",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*showOrderNew*/ ctx[8] === undefined && !('showOrderNew' in props)) {
    			console_1.warn("<OrderEdit> was created without expected prop 'showOrderNew'");
    		}
    	}

    	get showOrderNew() {
    		throw new Error("<OrderEdit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showOrderNew(value) {
    		throw new Error("<OrderEdit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get initialData() {
    		throw new Error("<OrderEdit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialData(value) {
    		throw new Error("<OrderEdit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get beingEdited() {
    		throw new Error("<OrderEdit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set beingEdited(value) {
    		throw new Error("<OrderEdit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\comps\order\Order.svelte generated by Svelte v3.50.1 */
    const file$5 = "src\\comps\\order\\Order.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (54:0) {#if order}
    function create_if_block$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*beingEdited*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(54:0) {#if order}",
    		ctx
    	});

    	return block;
    }

    // (58:4) {:else}
    function create_else_block$2(ctx) {
    	let div5;
    	let div2;
    	let div0;
    	let t0;
    	let span;
    	let t1;
    	let div1;
    	let t2;
    	let div3;
    	let tags;
    	let t3;
    	let div4;
    	let current;

    	function select_block_type_1(ctx, dirty) {
    		if (/*order*/ ctx[0].url) return create_if_block_4;
    		return create_else_block_2$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*order*/ ctx[0].ordered_by) return create_if_block_3$1;
    		return create_else_block_1$1;
    	}

    	let current_block_type_1 = select_block_type_2(ctx);
    	let if_block1 = current_block_type_1(ctx);
    	let if_block2 = (/*order*/ ctx[0].ordered_by === undefined || /*order*/ ctx[0].ordered_by === "You") && create_if_block_2$2(ctx);

    	tags = new Tags({
    			props: { tags: /*order*/ ctx[0].tags },
    			$$inline: true
    		});

    	let each_value = /*order*/ ctx[0].foods;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			span = element("span");
    			if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			if (if_block2) if_block2.c();
    			t2 = space();
    			div3 = element("div");
    			create_component(tags.$$.fragment);
    			t3 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "text-size--small svelte-1l12jbk");
    			add_location(span, file$5, 66, 20, 2151);
    			attr_dev(div0, "class", "left svelte-1l12jbk");
    			add_location(div0, file$5, 60, 16, 1825);
    			attr_dev(div1, "class", "right");
    			add_location(div1, file$5, 74, 16, 2519);
    			attr_dev(div2, "class", "order__header svelte-1l12jbk");
    			add_location(div2, file$5, 59, 12, 1780);
    			attr_dev(div3, "class", "order__tags svelte-1l12jbk");
    			add_location(div3, file$5, 81, 12, 2882);
    			attr_dev(div4, "class", "order__body svelte-1l12jbk");
    			add_location(div4, file$5, 84, 12, 2985);
    			attr_dev(div5, "class", "order svelte-1l12jbk");
    			add_location(div5, file$5, 58, 8, 1747);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div2);
    			append_dev(div2, div0);
    			if_block0.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			if_block1.m(span, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div5, t2);
    			append_dev(div5, div3);
    			mount_component(tags, div3, null);
    			append_dev(div5, t3);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_2(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(span, null);
    				}
    			}

    			if (/*order*/ ctx[0].ordered_by === undefined || /*order*/ ctx[0].ordered_by === "You") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$2(ctx);
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			const tags_changes = {};
    			if (dirty & /*order*/ 1) tags_changes.tags = /*order*/ ctx[0].tags;
    			tags.$set(tags_changes);

    			if (dirty & /*order*/ 1) {
    				each_value = /*order*/ ctx[0].foods;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div4, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tags.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tags.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if_block0.d();
    			if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_component(tags);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(58:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (55:4) {#if beingEdited}
    function create_if_block_1$2(ctx) {
    	let orderedit;
    	let updating_beingEdited;
    	let current;

    	function orderedit_beingEdited_binding(value) {
    		/*orderedit_beingEdited_binding*/ ctx[5](value);
    	}

    	let orderedit_props = {
    		showOrderNew: false,
    		initialData: /*createInitialData*/ ctx[4]()
    	};

    	if (/*beingEdited*/ ctx[1] !== void 0) {
    		orderedit_props.beingEdited = /*beingEdited*/ ctx[1];
    	}

    	orderedit = new OrderEdit({ props: orderedit_props, $$inline: true });
    	binding_callbacks.push(() => bind(orderedit, 'beingEdited', orderedit_beingEdited_binding));
    	orderedit.$on("refreshOrders", /*refreshOrders*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(orderedit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(orderedit, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const orderedit_changes = {};

    			if (!updating_beingEdited && dirty & /*beingEdited*/ 2) {
    				updating_beingEdited = true;
    				orderedit_changes.beingEdited = /*beingEdited*/ ctx[1];
    				add_flush_callback(() => updating_beingEdited = false);
    			}

    			orderedit.$set(orderedit_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(orderedit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(orderedit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(orderedit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(55:4) {#if beingEdited}",
    		ctx
    	});

    	return block;
    }

    // (64:20) {:else}
    function create_else_block_2$1(ctx) {
    	let span;
    	let t_value = title(/*order*/ ctx[0].restaurant) + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			set_style(span, "font-weight", "600");
    			attr_dev(span, "class", "svelte-1l12jbk");
    			add_location(span, file$5, 64, 24, 2039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*order*/ 1 && t_value !== (t_value = title(/*order*/ ctx[0].restaurant) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(64:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (62:20) {#if order.url}
    function create_if_block_4(ctx) {
    	let span;
    	let a;
    	let t_value = title(/*order*/ ctx[0].restaurant) + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*order*/ ctx[0].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-1l12jbk");
    			add_location(a, file$5, 62, 30, 1912);
    			attr_dev(span, "class", "svelte-1l12jbk");
    			add_location(span, file$5, 62, 24, 1906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*order*/ 1 && t_value !== (t_value = title(/*order*/ ctx[0].restaurant) + "")) set_data_dev(t, t_value);

    			if (dirty & /*order*/ 1 && a_href_value !== (a_href_value = /*order*/ ctx[0].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(62:20) {#if order.url}",
    		ctx
    	});

    	return block;
    }

    // (70:24) {:else}
    function create_else_block_1$1(ctx) {
    	let t0;
    	let t1_value = /*order*/ ctx[0].order_date + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Ordered on ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*order*/ 1 && t1_value !== (t1_value = /*order*/ ctx[0].order_date + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(70:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (68:24) {#if order.ordered_by}
    function create_if_block_3$1(ctx) {
    	let strong;
    	let t0_value = /*order*/ ctx[0].ordered_by + "";
    	let t0;
    	let t1;
    	let t2_value = /*order*/ ctx[0].order_date + "";
    	let t2;

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			t0 = text(t0_value);
    			t1 = text(" ordered on ");
    			t2 = text(t2_value);
    			add_location(strong, file$5, 68, 28, 2260);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, strong, anchor);
    			append_dev(strong, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*order*/ 1 && t0_value !== (t0_value = /*order*/ ctx[0].ordered_by + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*order*/ 1 && t2_value !== (t2_value = /*order*/ ctx[0].order_date + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(strong);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(68:24) {#if order.ordered_by}",
    		ctx
    	});

    	return block;
    }

    // (76:20) {#if order.ordered_by === undefined || order.ordered_by === "You"}
    function create_if_block_2$2(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Delete";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Edit";
    			add_location(button0, file$5, 76, 24, 2652);
    			add_location(button1, file$5, 77, 24, 2740);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(76:20) {#if order.ordered_by === undefined || order.ordered_by === \\\"You\\\"}",
    		ctx
    	});

    	return block;
    }

    // (86:16) {#each order.foods as food}
    function create_each_block$3(ctx) {
    	let food;
    	let current;

    	food = new Food({
    			props: { food: /*food*/ ctx[9] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(food.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(food, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const food_changes = {};
    			if (dirty & /*order*/ 1) food_changes.food = /*food*/ ctx[9];
    			food.$set(food_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(food.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(food.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(food, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(86:16) {#each order.foods as food}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*order*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*order*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*order*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Order', slots, []);
    	let { order } = $$props;
    	let beingEdited = false;
    	const dispatch = createEventDispatcher();

    	function refreshOrders() {
    		dispatch('refreshOrders');
    	}

    	async function deleteOrder(id) {
    		const resp = await fetch(`/api/delete-order/${id}`, {
    			method: 'POST',
    			mode: 'same-origin',
    			headers: { 'X-CSRFToken': getCookie('csrftoken') }
    		});

    		const data = await resp.json();

    		if (data["success"]) {
    			refreshOrders();
    		}
    	}

    	function createInitialData() {
    		return {
    			id: order.id,
    			restaurant: order.restaurant,
    			url: order.url,
    			foods: order.foods.map(food => {
    				return {
    					id: food.id,
    					name: food.name,
    					rating: food.rating,
    					tags: food.tags,
    					imageUrl: food.image === missingImage
    					? food.image_url ? food.image_url : ""
    					: food.image,
    					comment: food.comment
    				};
    			})
    		};
    	}

    	const writable_props = ['order'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Order> was created with unknown prop '${key}'`);
    	});

    	function orderedit_beingEdited_binding(value) {
    		beingEdited = value;
    		$$invalidate(1, beingEdited);
    	}

    	const click_handler = () => deleteOrder(order.id);
    	const click_handler_1 = () => $$invalidate(1, beingEdited = true);

    	$$self.$$set = $$props => {
    		if ('order' in $$props) $$invalidate(0, order = $$props.order);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Food,
    		Tags,
    		OrderEdit,
    		title,
    		getCookie,
    		missingImage,
    		order,
    		beingEdited,
    		dispatch,
    		refreshOrders,
    		deleteOrder,
    		createInitialData
    	});

    	$$self.$inject_state = $$props => {
    		if ('order' in $$props) $$invalidate(0, order = $$props.order);
    		if ('beingEdited' in $$props) $$invalidate(1, beingEdited = $$props.beingEdited);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		order,
    		beingEdited,
    		refreshOrders,
    		deleteOrder,
    		createInitialData,
    		orderedit_beingEdited_binding,
    		click_handler,
    		click_handler_1
    	];
    }

    class Order extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { order: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Order",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*order*/ ctx[0] === undefined && !('order' in props)) {
    			console.warn("<Order> was created without expected prop 'order'");
    		}
    	}

    	get order() {
    		throw new Error("<Order>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set order(value) {
    		throw new Error("<Order>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\comps\Orders.svelte generated by Svelte v3.50.1 */
    const file$4 = "src\\comps\\Orders.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[10] = list;
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (34:4) {#if showOrderNew}
    function create_if_block_3(ctx) {
    	let orderedit;
    	let updating_showOrderNew;
    	let current;

    	function orderedit_showOrderNew_binding(value) {
    		/*orderedit_showOrderNew_binding*/ ctx[7](value);
    	}

    	let orderedit_props = {};

    	if (/*showOrderNew*/ ctx[0] !== void 0) {
    		orderedit_props.showOrderNew = /*showOrderNew*/ ctx[0];
    	}

    	orderedit = new OrderEdit({ props: orderedit_props, $$inline: true });
    	binding_callbacks.push(() => bind(orderedit, 'showOrderNew', orderedit_showOrderNew_binding));
    	orderedit.$on("refreshOrders", /*getOrders*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(orderedit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(orderedit, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const orderedit_changes = {};

    			if (!updating_showOrderNew && dirty & /*showOrderNew*/ 1) {
    				updating_showOrderNew = true;
    				orderedit_changes.showOrderNew = /*showOrderNew*/ ctx[0];
    				add_flush_callback(() => updating_showOrderNew = false);
    			}

    			orderedit.$set(orderedit_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(orderedit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(orderedit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(orderedit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(34:4) {#if showOrderNew}",
    		ctx
    	});

    	return block;
    }

    // (45:4) {:else}
    function create_else_block$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*filteredOrders*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*order*/ ctx[9].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*filteredOrders, getOrders*/ 12) {
    				each_value = /*filteredOrders*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$2, each_1_anchor, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(45:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:59) 
    function create_if_block_2$1(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "No orders found";
    			attr_dev(h4, "class", "text-color-2");
    			add_location(h4, file$4, 43, 8, 1444);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(43:59) ",
    		ctx
    	});

    	return block;
    }

    // (41:51) 
    function create_if_block_1$1(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "No orders found. Click Add Order to create an entry";
    			attr_dev(h4, "class", "text-color-2");
    			add_location(h4, file$4, 41, 8, 1292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(41:51) ",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if orders === null}
    function create_if_block$2(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "loading__spinner");
    			add_location(div0, file$4, 38, 12, 1177);
    			attr_dev(div1, "class", "loading");
    			add_location(div1, file$4, 37, 8, 1142);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(37:4) {#if orders === null}",
    		ctx
    	});

    	return block;
    }

    // (46:8) {#each filteredOrders as order (order.id)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let order;
    	let updating_order;
    	let current;

    	function order_order_binding(value) {
    		/*order_order_binding*/ ctx[8](value, /*order*/ ctx[9], /*each_value*/ ctx[10], /*order_index*/ ctx[11]);
    	}

    	let order_props = {};

    	if (/*order*/ ctx[9] !== void 0) {
    		order_props.order = /*order*/ ctx[9];
    	}

    	order = new Order({ props: order_props, $$inline: true });
    	binding_callbacks.push(() => bind(order, 'order', order_order_binding));
    	order.$on("refreshOrders", /*getOrders*/ ctx[3]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(order.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(order, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const order_changes = {};

    			if (!updating_order && dirty & /*filteredOrders*/ 4) {
    				updating_order = true;
    				order_changes.order = /*order*/ ctx[9];
    				add_flush_callback(() => updating_order = false);
    			}

    			order.$set(order_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(order.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(order.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(order, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(46:8) {#each filteredOrders as order (order.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let current;
    	let if_block0 = /*showOrderNew*/ ctx[0] && create_if_block_3(ctx);
    	const if_block_creators = [create_if_block$2, create_if_block_1$1, create_if_block_2$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*orders*/ ctx[1] === null) return 0;
    		if (/*orders*/ ctx[1].length === 0 && !/*showOrderNew*/ ctx[0]) return 1;
    		if (/*filteredOrders*/ ctx[2].length === 0 && !/*showOrderNew*/ ctx[0]) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			attr_dev(div, "class", "orders svelte-9u0ews");
    			set_style(div, "width", containerWidth + "px");
    			add_location(div, file$4, 32, 0, 931);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showOrderNew*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*showOrderNew*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $sortBy;
    	let $searchFilters;
    	let $searchQuery;
    	validate_store(sortBy, 'sortBy');
    	component_subscribe($$self, sortBy, $$value => $$invalidate(4, $sortBy = $$value));
    	validate_store(searchFilters, 'searchFilters');
    	component_subscribe($$self, searchFilters, $$value => $$invalidate(5, $searchFilters = $$value));
    	validate_store(searchQuery, 'searchQuery');
    	component_subscribe($$self, searchQuery, $$value => $$invalidate(6, $searchQuery = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Orders', slots, []);
    	let { showOrderNew = false } = $$props;
    	let orders = null;
    	let filteredOrders = null;

    	async function getOrders() {
    		let response = await fetch('/api/orders-list');
    		$$invalidate(1, orders = await response.json());
    	}

    	onMount(() => {
    		getOrders();
    	});

    	const writable_props = ['showOrderNew'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Orders> was created with unknown prop '${key}'`);
    	});

    	function orderedit_showOrderNew_binding(value) {
    		showOrderNew = value;
    		$$invalidate(0, showOrderNew);
    	}

    	function order_order_binding(value, order, each_value, order_index) {
    		each_value[order_index] = value;
    		(((($$invalidate(2, filteredOrders), $$invalidate(1, orders)), $$invalidate(6, $searchQuery)), $$invalidate(5, $searchFilters)), $$invalidate(4, $sortBy));
    	}

    	$$self.$$set = $$props => {
    		if ('showOrderNew' in $$props) $$invalidate(0, showOrderNew = $$props.showOrderNew);
    	};

    	$$self.$capture_state = () => ({
    		sortBy,
    		searchFilters,
    		searchQuery,
    		onMount,
    		Order,
    		OrderEdit,
    		filterOrders,
    		containerWidth,
    		showOrderNew,
    		orders,
    		filteredOrders,
    		getOrders,
    		$sortBy,
    		$searchFilters,
    		$searchQuery
    	});

    	$$self.$inject_state = $$props => {
    		if ('showOrderNew' in $$props) $$invalidate(0, showOrderNew = $$props.showOrderNew);
    		if ('orders' in $$props) $$invalidate(1, orders = $$props.orders);
    		if ('filteredOrders' in $$props) $$invalidate(2, filteredOrders = $$props.filteredOrders);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*orders, $searchQuery, $searchFilters, $sortBy*/ 114) {
    			{
    				if (orders) {
    					$$invalidate(2, filteredOrders = filterOrders(orders, $searchQuery, $searchFilters.includes("tags"), $searchFilters.includes("foods"), $searchFilters.includes("restaurants"), $searchFilters.includes("my orders"), $sortBy));
    				}
    			}
    		}
    	};

    	return [
    		showOrderNew,
    		orders,
    		filteredOrders,
    		getOrders,
    		$sortBy,
    		$searchFilters,
    		$searchQuery,
    		orderedit_showOrderNew_binding,
    		order_order_binding
    	];
    }

    class Orders extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { showOrderNew: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Orders",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get showOrderNew() {
    		throw new Error("<Orders>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showOrderNew(value) {
    		throw new Error("<Orders>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\comps\Home.svelte generated by Svelte v3.50.1 */
    const file$3 = "src\\comps\\Home.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let searchbar;
    	let t0;
    	let actionbar;
    	let updating_showOrderNew;
    	let t1;
    	let orders;
    	let updating_showOrderNew_1;
    	let current;
    	searchbar = new SearchBar({ $$inline: true });

    	function actionbar_showOrderNew_binding(value) {
    		/*actionbar_showOrderNew_binding*/ ctx[2](value);
    	}

    	let actionbar_props = {};

    	if (/*showOrderNew*/ ctx[0] !== void 0) {
    		actionbar_props.showOrderNew = /*showOrderNew*/ ctx[0];
    	}

    	actionbar = new ActionBar({ props: actionbar_props, $$inline: true });
    	binding_callbacks.push(() => bind(actionbar, 'showOrderNew', actionbar_showOrderNew_binding));

    	function orders_showOrderNew_binding(value) {
    		/*orders_showOrderNew_binding*/ ctx[3](value);
    	}

    	let orders_props = {};

    	if (/*showOrderNew*/ ctx[0] !== void 0) {
    		orders_props.showOrderNew = /*showOrderNew*/ ctx[0];
    	}

    	orders = new Orders({ props: orders_props, $$inline: true });
    	binding_callbacks.push(() => bind(orders, 'showOrderNew', orders_showOrderNew_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(searchbar.$$.fragment);
    			t0 = space();
    			create_component(actionbar.$$.fragment);
    			t1 = space();
    			create_component(orders.$$.fragment);
    			attr_dev(div, "class", "home svelte-lqj6iy");
    			add_location(div, file$3, 9, 0, 227);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(searchbar, div, null);
    			append_dev(div, t0);
    			mount_component(actionbar, div, null);
    			append_dev(div, t1);
    			mount_component(orders, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const actionbar_changes = {};

    			if (!updating_showOrderNew && dirty & /*showOrderNew*/ 1) {
    				updating_showOrderNew = true;
    				actionbar_changes.showOrderNew = /*showOrderNew*/ ctx[0];
    				add_flush_callback(() => updating_showOrderNew = false);
    			}

    			actionbar.$set(actionbar_changes);
    			const orders_changes = {};

    			if (!updating_showOrderNew_1 && dirty & /*showOrderNew*/ 1) {
    				updating_showOrderNew_1 = true;
    				orders_changes.showOrderNew = /*showOrderNew*/ ctx[0];
    				add_flush_callback(() => updating_showOrderNew_1 = false);
    			}

    			orders.$set(orders_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchbar.$$.fragment, local);
    			transition_in(actionbar.$$.fragment, local);
    			transition_in(orders.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchbar.$$.fragment, local);
    			transition_out(actionbar.$$.fragment, local);
    			transition_out(orders.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(searchbar);
    			destroy_component(actionbar);
    			destroy_component(orders);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let { location } = $$props;
    	let showOrderNew = false;
    	const writable_props = ['location'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	function actionbar_showOrderNew_binding(value) {
    		showOrderNew = value;
    		$$invalidate(0, showOrderNew);
    	}

    	function orders_showOrderNew_binding(value) {
    		showOrderNew = value;
    		$$invalidate(0, showOrderNew);
    	}

    	$$self.$$set = $$props => {
    		if ('location' in $$props) $$invalidate(1, location = $$props.location);
    	};

    	$$self.$capture_state = () => ({
    		SearchBar,
    		ActionBar,
    		Orders,
    		location,
    		showOrderNew
    	});

    	$$self.$inject_state = $$props => {
    		if ('location' in $$props) $$invalidate(1, location = $$props.location);
    		if ('showOrderNew' in $$props) $$invalidate(0, showOrderNew = $$props.showOrderNew);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		showOrderNew,
    		location,
    		actionbar_showOrderNew_binding,
    		orders_showOrderNew_binding
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { location: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*location*/ ctx[1] === undefined && !('location' in props)) {
    			console.warn("<Home> was created without expected prop 'location'");
    		}
    	}

    	get location() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set location(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\comps\social\Social.svelte generated by Svelte v3.50.1 */
    const file$2 = "src\\comps\\social\\Social.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (65:4) {:else}
    function create_else_block(ctx) {
    	let div0;
    	let t;
    	let div1;

    	function select_block_type_1(ctx, dirty) {
    		if (/*linksList*/ ctx[0].length === 0) return create_if_block_2;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*linkRequestsList*/ ctx[1].length === 0) return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type_1 = select_block_type_2(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if_block0.c();
    			t = space();
    			div1 = element("div");
    			if_block1.c();
    			attr_dev(div0, "class", "links svelte-i6afvl");
    			add_location(div0, file$2, 65, 8, 1923);
    			attr_dev(div1, "class", "requests svelte-i6afvl");
    			add_location(div1, file$2, 84, 8, 2734);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if_block0.m(div0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			if_block1.m(div1, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_2(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_block0.d();
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(65:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (61:4) {#if linksList === null || linkRequestsList === null}
    function create_if_block$1(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "loading__spinner svelte-i6afvl");
    			add_location(div0, file$2, 62, 12, 1848);
    			attr_dev(div1, "class", "loading svelte-i6afvl");
    			add_location(div1, file$2, 61, 8, 1813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(61:4) {#if linksList === null || linkRequestsList === null}",
    		ctx
    	});

    	return block;
    }

    // (71:12) {:else}
    function create_else_block_2(ctx) {
    	let div0;
    	let h4;
    	let t1;
    	let div1;
    	let each_value_1 = /*linksList*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Linked Accounts";
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "text-color-2 svelte-i6afvl");
    			add_location(h4, file$2, 72, 20, 2232);
    			attr_dev(div0, "class", "links__header svelte-i6afvl");
    			add_location(div0, file$2, 71, 16, 2183);
    			attr_dev(div1, "class", "links__body svelte-i6afvl");
    			add_location(div1, file$2, 74, 16, 2319);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h4);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*removeLink, linksList*/ 5) {
    				each_value_1 = /*linksList*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(71:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (67:12) {#if linksList.length === 0}
    function create_if_block_2(ctx) {
    	let div;
    	let h4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "You are not linked with any other users";
    			attr_dev(h4, "class", "text-color-2 svelte-i6afvl");
    			add_location(h4, file$2, 68, 20, 2051);
    			attr_dev(div, "class", "links__header svelte-i6afvl");
    			add_location(div, file$2, 67, 16, 2002);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(67:12) {#if linksList.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (76:20) {#each linksList as link}
    function create_each_block_1(ctx) {
    	let div;
    	let span;
    	let t0_value = /*link*/ ctx[13].username + "";
    	let t0;
    	let t1;
    	let button;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*link*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "Remove";
    			t3 = space();
    			attr_dev(span, "class", "text-color-2 svelte-i6afvl");
    			add_location(span, file$2, 77, 28, 2465);
    			attr_dev(button, "class", "svelte-i6afvl");
    			add_location(button, file$2, 78, 28, 2544);
    			attr_dev(div, "class", "link svelte-i6afvl");
    			add_location(div, file$2, 76, 24, 2417);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(div, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*linksList*/ 1 && t0_value !== (t0_value = /*link*/ ctx[13].username + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(76:20) {#each linksList as link}",
    		ctx
    	});

    	return block;
    }

    // (90:8) {:else}
    function create_else_block_1(ctx) {
    	let div0;
    	let h4;
    	let t0;
    	let t1_value = /*linkRequestsList*/ ctx[1].length + "";
    	let t1;
    	let t2;
    	let t3;
    	let div1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*linkRequestsList*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*request*/ ctx[10].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h4 = element("h4");
    			t0 = text("You have ");
    			t1 = text(t1_value);
    			t2 = text(" link requests");
    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "text-color-2 svelte-i6afvl");
    			add_location(h4, file$2, 91, 16, 3020);
    			attr_dev(div0, "class", "requests__header svelte-i6afvl");
    			add_location(div0, file$2, 90, 12, 2972);
    			attr_dev(div1, "class", "requests__body svelte-i6afvl");
    			add_location(div1, file$2, 93, 12, 3132);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h4);
    			append_dev(h4, t0);
    			append_dev(h4, t1);
    			append_dev(h4, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*linkRequestsList*/ 2 && t1_value !== (t1_value = /*linkRequestsList*/ ctx[1].length + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*respondToLinkRequest, linkRequestsList*/ 10) {
    				each_value = /*linkRequestsList*/ ctx[1];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div1, destroy_block, create_each_block$1, null, get_each_context$1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(90:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (86:8) {#if linkRequestsList.length === 0}
    function create_if_block_1(ctx) {
    	let div;
    	let h4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "You have no pending requests";
    			attr_dev(h4, "class", "text-color-2 svelte-i6afvl");
    			add_location(h4, file$2, 87, 16, 2863);
    			attr_dev(div, "class", "requests__header svelte-i6afvl");
    			add_location(div, file$2, 86, 12, 2815);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(86:8) {#if linkRequestsList.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (95:12) {#each linkRequestsList as request (request.id)}
    function create_each_block$1(key_1, ctx) {
    	let p;
    	let t0_value = /*request*/ ctx[10].username + "";
    	let t0;
    	let t1;
    	let div;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[6](/*request*/ ctx[10]);
    	}

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[7](/*request*/ ctx[10]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Accept";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Decline";
    			t5 = space();
    			attr_dev(p, "class", "text-color-2 svelte-i6afvl");
    			add_location(p, file$2, 95, 16, 3240);
    			attr_dev(button0, "class", "svelte-i6afvl");
    			add_location(button0, file$2, 97, 20, 3347);
    			attr_dev(button1, "class", "svelte-i6afvl");
    			add_location(button1, file$2, 98, 20, 3448);
    			attr_dev(div, "class", "buttons svelte-i6afvl");
    			add_location(div, file$2, 96, 16, 3304);
    			this.first = p;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t3);
    			append_dev(div, button1);
    			append_dev(div, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler_1, false, false, false),
    					listen_dev(button1, "click", click_handler_2, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*linkRequestsList*/ 2 && t0_value !== (t0_value = /*request*/ ctx[10].username + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(95:12) {#each linkRequestsList as request (request.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*linksList*/ ctx[0] === null || /*linkRequestsList*/ ctx[1] === null) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "container svelte-i6afvl");
    			add_location(div, file$2, 59, 0, 1721);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Social', slots, []);
    	let { location } = $$props;
    	let linksList = null;
    	let linkRequestsList = null;

    	async function getLinksList() {
    		const resp = await fetch('/api/links-list');
    		$$invalidate(0, linksList = await resp.json());
    	}

    	async function getLinkRequestsList() {
    		let resp = await (await fetch('/api/link-requests-list')).json();
    		$$invalidate(1, linkRequestsList = resp['users']);
    	}

    	onMount(() => {
    		getLinksList();
    		getLinkRequestsList();
    	});

    	async function removeLink(id) {
    		const resp = await fetch(`/api/remove-link/${id}`, {
    			method: 'POST',
    			mode: 'same-origin',
    			headers: { 'X-CSRFToken': getCookie('csrftoken') }
    		});

    		const data = await resp.json();

    		if (data["success"]) {
    			getLinksList();
    		}
    	}

    	async function respondToLinkRequest(id, accept) {
    		let url;

    		accept
    		? url = `/api/accept-link-request`
    		: url = `/api/reject-link-request`;

    		const resp = await (await fetch(url, {
    			method: 'POST',
    			mode: 'same-origin',
    			headers: {
    				'Content-Type': 'application/json',
    				'X-CSRFToken': getCookie('csrftoken')
    			},
    			body: JSON.stringify({ id })
    		})).json();

    		if (resp["success"] && accept) {
    			getLinkRequestsList();
    			getLinksList();
    		} else if (resp["success"] && !accept) {
    			getLinkRequestsList();
    		}
    	}

    	const writable_props = ['location'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Social> was created with unknown prop '${key}'`);
    	});

    	const click_handler = link => removeLink(link.id);
    	const click_handler_1 = request => respondToLinkRequest(request.id, true);
    	const click_handler_2 = request => respondToLinkRequest(request.id, false);

    	$$self.$$set = $$props => {
    		if ('location' in $$props) $$invalidate(4, location = $$props.location);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		getCookie,
    		location,
    		linksList,
    		linkRequestsList,
    		getLinksList,
    		getLinkRequestsList,
    		removeLink,
    		respondToLinkRequest
    	});

    	$$self.$inject_state = $$props => {
    		if ('location' in $$props) $$invalidate(4, location = $$props.location);
    		if ('linksList' in $$props) $$invalidate(0, linksList = $$props.linksList);
    		if ('linkRequestsList' in $$props) $$invalidate(1, linkRequestsList = $$props.linkRequestsList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		linksList,
    		linkRequestsList,
    		removeLink,
    		respondToLinkRequest,
    		location,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Social extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { location: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Social",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*location*/ ctx[4] === undefined && !('location' in props)) {
    			console.warn("<Social> was created without expected prop 'location'");
    		}
    	}

    	get location() {
    		throw new Error("<Social>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set location(value) {
    		throw new Error("<Social>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\comps\social\SearchUsers.svelte generated by Svelte v3.50.1 */
    const file$1 = "src\\comps\\social\\SearchUsers.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (43:8) {#if message}
    function create_if_block(ctx) {
    	let h4;
    	let t;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t = text(/*message*/ ctx[2]);
    			attr_dev(h4, "class", "text-color-2");
    			add_location(h4, file$1, 43, 12, 1442);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 4) set_data_dev(t, /*message*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(43:8) {#if message}",
    		ctx
    	});

    	return block;
    }

    // (46:8) {#each searchResults as result}
    function create_each_block(ctx) {
    	let div;
    	let span;
    	let t0_value = /*result*/ ctx[8].username + "";
    	let t0;
    	let t1;
    	let button;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*result*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "Add";
    			t3 = space();
    			attr_dev(span, "class", "text-color-2");
    			add_location(span, file$1, 47, 16, 1596);
    			attr_dev(button, "class", "svelte-1w4wxkd");
    			add_location(button, file$1, 50, 16, 1705);
    			attr_dev(div, "class", "search-result svelte-1w4wxkd");
    			add_location(div, file$1, 46, 12, 1551);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(div, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*searchResults*/ 2 && t0_value !== (t0_value = /*result*/ ctx[8].username + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(46:8) {#each searchResults as result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let div0;
    	let input;
    	let t0;
    	let button;
    	let t2;
    	let div1;
    	let t3;
    	let mounted;
    	let dispose;
    	let if_block = /*message*/ ctx[2] && create_if_block(ctx);
    	let each_value = /*searchResults*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "Search";
    			t2 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search Users");
    			attr_dev(input, "class", "svelte-1w4wxkd");
    			add_location(input, file$1, 38, 8, 1171);
    			attr_dev(button, "class", "svelte-1w4wxkd");
    			add_location(button, file$1, 39, 8, 1254);
    			attr_dev(div0, "class", "input-field svelte-1w4wxkd");
    			add_location(div0, file$1, 37, 4, 1136);
    			attr_dev(div1, "class", "search-results svelte-1w4wxkd");
    			set_style(div1, "width", "340px");
    			toggle_class(div1, "bordered", /*searchResults*/ ctx[1].length > 0);
    			add_location(div1, file$1, 41, 4, 1313);
    			attr_dev(div2, "class", "search-users-container svelte-1w4wxkd");
    			add_location(div2, file$1, 36, 0, 1094);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*searchQuery*/ ctx[0]);
    			append_dev(div0, t0);
    			append_dev(div0, button);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    					listen_dev(button, "click", /*search*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*searchQuery*/ 1 && input.value !== /*searchQuery*/ ctx[0]) {
    				set_input_value(input, /*searchQuery*/ ctx[0]);
    			}

    			if (/*message*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div1, t3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*linkRequest, searchResults*/ 18) {
    				each_value = /*searchResults*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*searchResults*/ 2) {
    				toggle_class(div1, "bordered", /*searchResults*/ ctx[1].length > 0);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchUsers', slots, []);
    	let { location } = $$props;
    	let searchQuery = "";
    	let searchResults = [];
    	let message = "";

    	async function search() {
    		const data = new URLSearchParams();
    		data.append("q", searchQuery);
    		let resp = await (await fetch(`/api/search-users?${data}`)).json();

    		if (resp["success"]) {
    			$$invalidate(1, searchResults = resp["users"]);

    			searchResults.length === 0
    			? $$invalidate(2, message = "No results found")
    			: $$invalidate(2, message = "");
    		} else {
    			$$invalidate(1, searchResults = []);
    			$$invalidate(2, message = resp["message"]);
    		}
    	}

    	async function linkRequest(id) {
    		const data = new FormData();
    		data.append("id", id);

    		let resp = await (await fetch(`/api/send-link-request`, {
    			method: "POST",
    			mode: "same-origin",
    			headers: { "X-CSRFToken": getCookie("csrftoken") },
    			body: data
    		})).json();

    		$$invalidate(1, searchResults = []);
    		$$invalidate(2, message = resp["message"]);
    	}

    	const writable_props = ['location'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchUsers> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		searchQuery = this.value;
    		$$invalidate(0, searchQuery);
    	}

    	const click_handler = result => linkRequest(result.id);

    	$$self.$$set = $$props => {
    		if ('location' in $$props) $$invalidate(5, location = $$props.location);
    	};

    	$$self.$capture_state = () => ({
    		getCookie,
    		location,
    		searchQuery,
    		searchResults,
    		message,
    		search,
    		linkRequest
    	});

    	$$self.$inject_state = $$props => {
    		if ('location' in $$props) $$invalidate(5, location = $$props.location);
    		if ('searchQuery' in $$props) $$invalidate(0, searchQuery = $$props.searchQuery);
    		if ('searchResults' in $$props) $$invalidate(1, searchResults = $$props.searchResults);
    		if ('message' in $$props) $$invalidate(2, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		searchQuery,
    		searchResults,
    		message,
    		search,
    		linkRequest,
    		location,
    		input_input_handler,
    		click_handler
    	];
    }

    class SearchUsers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { location: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchUsers",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*location*/ ctx[5] === undefined && !('location' in props)) {
    			console.warn("<SearchUsers> was created without expected prop 'location'");
    		}
    	}

    	get location() {
    		throw new Error("<SearchUsers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set location(value) {
    		throw new Error("<SearchUsers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.50.1 */
    const file = "src\\App.svelte";

    // (9:4) <Router>
    function create_default_slot(ctx) {
    	let nav;
    	let a0;
    	let t1;
    	let a1;
    	let t3;
    	let a2;
    	let t5;
    	let div;
    	let route0;
    	let t6;
    	let route1;
    	let t7;
    	let route2;
    	let current;

    	route0 = new Route({
    			props: { path: "/", component: Home },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: { path: "/links-list", component: Social },
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/search-users",
    				component: SearchUsers
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "Orders";
    			t1 = space();
    			a1 = element("a");
    			a1.textContent = "Linked Accounts";
    			t3 = space();
    			a2 = element("a");
    			a2.textContent = "Search Users";
    			t5 = space();
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t6 = space();
    			create_component(route1.$$.fragment);
    			t7 = space();
    			create_component(route2.$$.fragment);
    			attr_dev(a0, "class", "nav-link svelte-1b6nmax");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file, 10, 12, 305);
    			attr_dev(a1, "class", "nav-link svelte-1b6nmax");
    			attr_dev(a1, "href", "/links-list");
    			add_location(a1, file, 11, 12, 358);
    			attr_dev(a2, "class", "nav-link svelte-1b6nmax");
    			attr_dev(a2, "href", "/search-users");
    			add_location(a2, file, 12, 12, 430);
    			attr_dev(nav, "class", "svelte-1b6nmax");
    			add_location(nav, file, 9, 8, 286);
    			attr_dev(div, "class", "content svelte-1b6nmax");
    			add_location(div, file, 14, 8, 513);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, a0);
    			append_dev(nav, t1);
    			append_dev(nav, a1);
    			append_dev(nav, t3);
    			append_dev(nav, a2);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t6);
    			mount_component(route1, div, null);
    			append_dev(div, t7);
    			mount_component(route2, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(9:4) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			attr_dev(main, "class", "main svelte-1b6nmax");
    			add_location(main, file, 7, 0, 243);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router, Route, Home, Social, SearchUsers });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
