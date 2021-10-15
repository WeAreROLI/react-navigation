var __BUNDLE_START_TIME__=this.nativePerformanceNow?nativePerformanceNow():Date.now(),__DEV__=true,process=this.process||{},__METRO_GLOBAL_PREFIX__='';process.env=process.env||{};process.env.NODE_ENV=process.env.NODE_ENV||"development";
(function (global) {
  "use strict";

  global.__r = metroRequire;
  global[`${__METRO_GLOBAL_PREFIX__}__d`] = define;
  global.__c = clear;
  global.__registerSegment = registerSegment;
  var modules = clear();
  const EMPTY = {};
  const {
    hasOwnProperty
  } = {};

  if (__DEV__) {
    global.$RefreshReg$ = () => {};

    global.$RefreshSig$ = () => type => type;
  }

  function clear() {
    modules = Object.create(null);
    return modules;
  }

  if (__DEV__) {
    var verboseNamesToModuleIds = Object.create(null);
    var initializingModuleIds = [];
  }

  function define(factory, moduleId, dependencyMap) {
    if (modules[moduleId] != null) {
      if (__DEV__) {
        const inverseDependencies = arguments[4];

        if (inverseDependencies) {
          global.__accept(moduleId, factory, dependencyMap, inverseDependencies);
        }
      }

      return;
    }

    const mod = {
      dependencyMap,
      factory,
      hasError: false,
      importedAll: EMPTY,
      importedDefault: EMPTY,
      isInitialized: false,
      publicModule: {
        exports: {}
      }
    };
    modules[moduleId] = mod;

    if (__DEV__) {
      mod.hot = createHotReloadingObject();
      const verboseName = arguments[3];

      if (verboseName) {
        mod.verboseName = verboseName;
        verboseNamesToModuleIds[verboseName] = moduleId;
      }
    }
  }

  function metroRequire(moduleId) {
    if (__DEV__ && typeof moduleId === "string") {
      const verboseName = moduleId;
      moduleId = verboseNamesToModuleIds[verboseName];

      if (moduleId == null) {
        throw new Error(`Unknown named module: "${verboseName}"`);
      } else {
        console.warn(`Requiring module "${verboseName}" by name is only supported for ` + "debugging purposes and will BREAK IN PRODUCTION!");
      }
    }

    const moduleIdReallyIsNumber = moduleId;

    if (__DEV__) {
      const initializingIndex = initializingModuleIds.indexOf(moduleIdReallyIsNumber);

      if (initializingIndex !== -1) {
        const cycle = initializingModuleIds.slice(initializingIndex).map(id => modules[id] ? modules[id].verboseName : "[unknown]");
        cycle.push(cycle[0]);
        console.warn(`Require cycle: ${cycle.join(" -> ")}\n\n` + "Require cycles are allowed, but can result in uninitialized values. " + "Consider refactoring to remove the need for a cycle.");
      }
    }

    const module = modules[moduleIdReallyIsNumber];
    return module && module.isInitialized ? module.publicModule.exports : guardedLoadModule(moduleIdReallyIsNumber, module);
  }

  function metroImportDefault(moduleId) {
    if (__DEV__ && typeof moduleId === "string") {
      const verboseName = moduleId;
      moduleId = verboseNamesToModuleIds[verboseName];
    }

    const moduleIdReallyIsNumber = moduleId;

    if (modules[moduleIdReallyIsNumber] && modules[moduleIdReallyIsNumber].importedDefault !== EMPTY) {
      return modules[moduleIdReallyIsNumber].importedDefault;
    }

    const exports = metroRequire(moduleIdReallyIsNumber);
    const importedDefault = exports && exports.__esModule ? exports.default : exports;
    return modules[moduleIdReallyIsNumber].importedDefault = importedDefault;
  }

  metroRequire.importDefault = metroImportDefault;

  function metroImportAll(moduleId) {
    if (__DEV__ && typeof moduleId === "string") {
      const verboseName = moduleId;
      moduleId = verboseNamesToModuleIds[verboseName];
    }

    const moduleIdReallyIsNumber = moduleId;

    if (modules[moduleIdReallyIsNumber] && modules[moduleIdReallyIsNumber].importedAll !== EMPTY) {
      return modules[moduleIdReallyIsNumber].importedAll;
    }

    const exports = metroRequire(moduleIdReallyIsNumber);
    let importedAll;

    if (exports && exports.__esModule) {
      importedAll = exports;
    } else {
      importedAll = {};

      if (exports) {
        for (const key in exports) {
          if (hasOwnProperty.call(exports, key)) {
            importedAll[key] = exports[key];
          }
        }
      }

      importedAll.default = exports;
    }

    return modules[moduleIdReallyIsNumber].importedAll = importedAll;
  }

  metroRequire.importAll = metroImportAll;
  let inGuard = false;

  function guardedLoadModule(moduleId, module) {
    if (!inGuard && global.ErrorUtils) {
      inGuard = true;
      let returnValue;

      try {
        returnValue = loadModuleImplementation(moduleId, module);
      } catch (e) {
        global.ErrorUtils.reportFatalError(e);
      }

      inGuard = false;
      return returnValue;
    } else {
      return loadModuleImplementation(moduleId, module);
    }
  }

  const ID_MASK_SHIFT = 16;
  const LOCAL_ID_MASK = ~0 >>> ID_MASK_SHIFT;

  function unpackModuleId(moduleId) {
    const segmentId = moduleId >>> ID_MASK_SHIFT;
    const localId = moduleId & LOCAL_ID_MASK;
    return {
      segmentId,
      localId
    };
  }

  metroRequire.unpackModuleId = unpackModuleId;

  function packModuleId(value) {
    return (value.segmentId << ID_MASK_SHIFT) + value.localId;
  }

  metroRequire.packModuleId = packModuleId;
  const moduleDefinersBySegmentID = [];
  const definingSegmentByModuleID = new Map();

  function registerSegment(segmentId, moduleDefiner, moduleIds) {
    moduleDefinersBySegmentID[segmentId] = moduleDefiner;

    if (__DEV__) {
      if (segmentId === 0 && moduleIds) {
        throw new Error("registerSegment: Expected moduleIds to be null for main segment");
      }

      if (segmentId !== 0 && !moduleIds) {
        throw new Error("registerSegment: Expected moduleIds to be passed for segment #" + segmentId);
      }
    }

    if (moduleIds) {
      moduleIds.forEach(moduleId => {
        if (!modules[moduleId] && !definingSegmentByModuleID.has(moduleId)) {
          definingSegmentByModuleID.set(moduleId, segmentId);
        }
      });
    }
  }

  function loadModuleImplementation(moduleId, module) {
    if (!module && moduleDefinersBySegmentID.length > 0) {
      var _definingSegmentByMod;

      const segmentId = (_definingSegmentByMod = definingSegmentByModuleID.get(moduleId)) !== null && _definingSegmentByMod !== void 0 ? _definingSegmentByMod : 0;
      const definer = moduleDefinersBySegmentID[segmentId];

      if (definer != null) {
        definer(moduleId);
        module = modules[moduleId];
        definingSegmentByModuleID.delete(moduleId);
      }
    }

    const nativeRequire = global.nativeRequire;

    if (!module && nativeRequire) {
      const {
        segmentId,
        localId
      } = unpackModuleId(moduleId);
      nativeRequire(localId, segmentId);
      module = modules[moduleId];
    }

    if (!module) {
      throw unknownModuleError(moduleId);
    }

    if (module.hasError) {
      throw moduleThrewError(moduleId, module.error);
    }

    if (__DEV__) {
      var Systrace = requireSystrace();
      var Refresh = requireRefresh();
    }

    module.isInitialized = true;
    const {
      factory,
      dependencyMap
    } = module;

    if (__DEV__) {
      initializingModuleIds.push(moduleId);
    }

    try {
      if (__DEV__) {
        Systrace.beginEvent("JS_require_" + (module.verboseName || moduleId));
      }

      const moduleObject = module.publicModule;

      if (__DEV__) {
        moduleObject.hot = module.hot;
        var prevRefreshReg = global.$RefreshReg$;
        var prevRefreshSig = global.$RefreshSig$;

        if (Refresh != null) {
          const RefreshRuntime = Refresh;

          global.$RefreshReg$ = (type, id) => {
            RefreshRuntime.register(type, moduleId + " " + id);
          };

          global.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
        }
      }

      moduleObject.id = moduleId;
      factory(global, metroRequire, metroImportDefault, metroImportAll, moduleObject, moduleObject.exports, dependencyMap);

      if (!__DEV__) {
        module.factory = undefined;
        module.dependencyMap = undefined;
      }

      if (__DEV__) {
        Systrace.endEvent();

        if (Refresh != null) {
          registerExportsForReactRefresh(Refresh, moduleObject.exports, moduleId);
        }
      }

      return moduleObject.exports;
    } catch (e) {
      module.hasError = true;
      module.error = e;
      module.isInitialized = false;
      module.publicModule.exports = undefined;
      throw e;
    } finally {
      if (__DEV__) {
        if (initializingModuleIds.pop() !== moduleId) {
          throw new Error("initializingModuleIds is corrupt; something is terribly wrong");
        }

        global.$RefreshReg$ = prevRefreshReg;
        global.$RefreshSig$ = prevRefreshSig;
      }
    }
  }

  function unknownModuleError(id) {
    let message = 'Requiring unknown module "' + id + '".';

    if (__DEV__) {
      message += " If you are sure the module exists, try restarting Metro. " + "You may also want to run `yarn` or `npm install`.";
    }

    return Error(message);
  }

  function moduleThrewError(id, error) {
    const displayName = __DEV__ && modules[id] && modules[id].verboseName || id;
    return Error('Requiring module "' + displayName + '", which threw an exception: ' + error);
  }

  if (__DEV__) {
    metroRequire.Systrace = {
      beginEvent: () => {},
      endEvent: () => {}
    };

    metroRequire.getModules = () => {
      return modules;
    };

    var createHotReloadingObject = function () {
      const hot = {
        _acceptCallback: null,
        _disposeCallback: null,
        _didAccept: false,
        accept: callback => {
          hot._didAccept = true;
          hot._acceptCallback = callback;
        },
        dispose: callback => {
          hot._disposeCallback = callback;
        }
      };
      return hot;
    };

    let reactRefreshTimeout = null;

    const metroHotUpdateModule = function (id, factory, dependencyMap, inverseDependencies) {
      const mod = modules[id];

      if (!mod) {
        if (factory) {
          return;
        }

        throw unknownModuleError(id);
      }

      if (!mod.hasError && !mod.isInitialized) {
        mod.factory = factory;
        mod.dependencyMap = dependencyMap;
        return;
      }

      const Refresh = requireRefresh();
      const refreshBoundaryIDs = new Set();
      let didBailOut = false;
      const updatedModuleIDs = topologicalSort([id], pendingID => {
        const pendingModule = modules[pendingID];

        if (pendingModule == null) {
          return [];
        }

        const pendingHot = pendingModule.hot;

        if (pendingHot == null) {
          throw new Error("[Refresh] Expected module.hot to always exist in DEV.");
        }

        let canAccept = pendingHot._didAccept;

        if (!canAccept && Refresh != null) {
          const isBoundary = isReactRefreshBoundary(Refresh, pendingModule.publicModule.exports);

          if (isBoundary) {
            canAccept = true;
            refreshBoundaryIDs.add(pendingID);
          }
        }

        if (canAccept) {
          return [];
        }

        const parentIDs = inverseDependencies[pendingID];

        if (parentIDs.length === 0) {
          performFullRefresh("No root boundary", {
            source: mod,
            failed: pendingModule
          });
          didBailOut = true;
          return [];
        }

        return parentIDs;
      }, () => didBailOut).reverse();

      if (didBailOut) {
        return;
      }

      const seenModuleIDs = new Set();

      for (let i = 0; i < updatedModuleIDs.length; i++) {
        const updatedID = updatedModuleIDs[i];

        if (seenModuleIDs.has(updatedID)) {
          continue;
        }

        seenModuleIDs.add(updatedID);
        const updatedMod = modules[updatedID];

        if (updatedMod == null) {
          throw new Error("[Refresh] Expected to find the updated module.");
        }

        const prevExports = updatedMod.publicModule.exports;
        const didError = runUpdatedModule(updatedID, updatedID === id ? factory : undefined, updatedID === id ? dependencyMap : undefined);
        const nextExports = updatedMod.publicModule.exports;

        if (didError) {
          return;
        }

        if (refreshBoundaryIDs.has(updatedID)) {
          const isNoLongerABoundary = !isReactRefreshBoundary(Refresh, nextExports);
          const didInvalidate = shouldInvalidateReactRefreshBoundary(Refresh, prevExports, nextExports);

          if (isNoLongerABoundary || didInvalidate) {
            const parentIDs = inverseDependencies[updatedID];

            if (parentIDs.length === 0) {
              performFullRefresh(isNoLongerABoundary ? "No longer a boundary" : "Invalidated boundary", {
                source: mod,
                failed: updatedMod
              });
              return;
            }

            for (let j = 0; j < parentIDs.length; j++) {
              const parentID = parentIDs[j];
              const parentMod = modules[parentID];

              if (parentMod == null) {
                throw new Error("[Refresh] Expected to find parent module.");
              }

              const canAcceptParent = isReactRefreshBoundary(Refresh, parentMod.publicModule.exports);

              if (canAcceptParent) {
                refreshBoundaryIDs.add(parentID);
                updatedModuleIDs.push(parentID);
              } else {
                performFullRefresh("Invalidated boundary", {
                  source: mod,
                  failed: parentMod
                });
                return;
              }
            }
          }
        }
      }

      if (Refresh != null) {
        if (reactRefreshTimeout == null) {
          reactRefreshTimeout = setTimeout(() => {
            reactRefreshTimeout = null;
            Refresh.performReactRefresh();
          }, 30);
        }
      }
    };

    const topologicalSort = function (roots, getEdges, earlyStop) {
      const result = [];
      const visited = new Set();

      function traverseDependentNodes(node) {
        visited.add(node);
        const dependentNodes = getEdges(node);

        if (earlyStop(node)) {
          return;
        }

        dependentNodes.forEach(dependent => {
          if (visited.has(dependent)) {
            return;
          }

          traverseDependentNodes(dependent);
        });
        result.push(node);
      }

      roots.forEach(root => {
        if (!visited.has(root)) {
          traverseDependentNodes(root);
        }
      });
      return result;
    };

    const runUpdatedModule = function (id, factory, dependencyMap) {
      const mod = modules[id];

      if (mod == null) {
        throw new Error("[Refresh] Expected to find the module.");
      }

      const {
        hot
      } = mod;

      if (!hot) {
        throw new Error("[Refresh] Expected module.hot to always exist in DEV.");
      }

      if (hot._disposeCallback) {
        try {
          hot._disposeCallback();
        } catch (error) {
          console.error(`Error while calling dispose handler for module ${id}: `, error);
        }
      }

      if (factory) {
        mod.factory = factory;
      }

      if (dependencyMap) {
        mod.dependencyMap = dependencyMap;
      }

      mod.hasError = false;
      mod.error = undefined;
      mod.importedAll = EMPTY;
      mod.importedDefault = EMPTY;
      mod.isInitialized = false;
      const prevExports = mod.publicModule.exports;
      mod.publicModule.exports = {};
      hot._didAccept = false;
      hot._acceptCallback = null;
      hot._disposeCallback = null;
      metroRequire(id);

      if (mod.hasError) {
        mod.hasError = false;
        mod.isInitialized = true;
        mod.error = null;
        mod.publicModule.exports = prevExports;
        return true;
      }

      if (hot._acceptCallback) {
        try {
          hot._acceptCallback();
        } catch (error) {
          console.error(`Error while calling accept handler for module ${id}: `, error);
        }
      }

      return false;
    };

    const performFullRefresh = (reason, modules) => {
      if (typeof window !== "undefined" && window.location != null && typeof window.location.reload === "function") {
        window.location.reload();
      } else {
        const Refresh = requireRefresh();

        if (Refresh != null) {
          var _modules$source$verbo, _modules$source, _modules$failed$verbo, _modules$failed;

          const sourceName = (_modules$source$verbo = (_modules$source = modules.source) === null || _modules$source === void 0 ? void 0 : _modules$source.verboseName) !== null && _modules$source$verbo !== void 0 ? _modules$source$verbo : "unknown";
          const failedName = (_modules$failed$verbo = (_modules$failed = modules.failed) === null || _modules$failed === void 0 ? void 0 : _modules$failed.verboseName) !== null && _modules$failed$verbo !== void 0 ? _modules$failed$verbo : "unknown";
          Refresh.performFullRefresh(`Fast Refresh - ${reason} <${sourceName}> <${failedName}>`);
        } else {
          console.warn("Could not reload the application after an edit.");
        }
      }
    };

    var isReactRefreshBoundary = function (Refresh, moduleExports) {
      if (Refresh.isLikelyComponentType(moduleExports)) {
        return true;
      }

      if (moduleExports == null || typeof moduleExports !== "object") {
        return false;
      }

      let hasExports = false;
      let areAllExportsComponents = true;

      for (const key in moduleExports) {
        hasExports = true;

        if (key === "__esModule") {
          continue;
        }

        const desc = Object.getOwnPropertyDescriptor(moduleExports, key);

        if (desc && desc.get) {
          return false;
        }

        const exportValue = moduleExports[key];

        if (!Refresh.isLikelyComponentType(exportValue)) {
          areAllExportsComponents = false;
        }
      }

      return hasExports && areAllExportsComponents;
    };

    var shouldInvalidateReactRefreshBoundary = (Refresh, prevExports, nextExports) => {
      const prevSignature = getRefreshBoundarySignature(Refresh, prevExports);
      const nextSignature = getRefreshBoundarySignature(Refresh, nextExports);

      if (prevSignature.length !== nextSignature.length) {
        return true;
      }

      for (let i = 0; i < nextSignature.length; i++) {
        if (prevSignature[i] !== nextSignature[i]) {
          return true;
        }
      }

      return false;
    };

    var getRefreshBoundarySignature = (Refresh, moduleExports) => {
      const signature = [];
      signature.push(Refresh.getFamilyByType(moduleExports));

      if (moduleExports == null || typeof moduleExports !== "object") {
        return signature;
      }

      for (const key in moduleExports) {
        if (key === "__esModule") {
          continue;
        }

        const desc = Object.getOwnPropertyDescriptor(moduleExports, key);

        if (desc && desc.get) {
          continue;
        }

        const exportValue = moduleExports[key];
        signature.push(key);
        signature.push(Refresh.getFamilyByType(exportValue));
      }

      return signature;
    };

    var registerExportsForReactRefresh = (Refresh, moduleExports, moduleID) => {
      Refresh.register(moduleExports, moduleID + " %exports%");

      if (moduleExports == null || typeof moduleExports !== "object") {
        return;
      }

      for (const key in moduleExports) {
        const desc = Object.getOwnPropertyDescriptor(moduleExports, key);

        if (desc && desc.get) {
          continue;
        }

        const exportValue = moduleExports[key];
        const typeID = moduleID + " %exports% " + key;
        Refresh.register(exportValue, typeID);
      }
    };

    global.__accept = metroHotUpdateModule;
  }

  if (__DEV__) {
    var requireSystrace = function requireSystrace() {
      return global[__METRO_GLOBAL_PREFIX__ + "__SYSTRACE"] || metroRequire.Systrace;
    };

    var requireRefresh = function requireRefresh() {
      return global[__METRO_GLOBAL_PREFIX__ + "__ReactRefresh"] || metroRequire.Refresh;
    };
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this);
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    Component: true
  };
  exports.Component = Component;
  var _antd = global.antd;
  var _flipper = global.Flipper;
  var _flipperPlugin = global.FlipperPlugin;

  var React = _interopRequireWildcard(global.React);

  var _LinkingTester = _$$_REQUIRE(_dependencyMap[0], "./LinkingTester");

  var _Logs = _$$_REQUIRE(_dependencyMap[1], "./Logs");

  var _useStore = _$$_REQUIRE(_dependencyMap[2], "./useStore");

  var _plugin = _$$_REQUIRE(_dependencyMap[3], "./plugin");

  Object.keys(_plugin).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _plugin[key]) return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _plugin[key];
      }
    });
  });

  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

  function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  const {
    TabPane
  } = _antd.Tabs;

  function Component() {
    const store = (0, _useStore.useStore)();
    const [activeKey, setActiveKey] = global.React.useState('logs');
    return global.React.createElement(_antd.Tabs, {
      activeKey: activeKey,
      onChange: setActiveKey,
      tabBarStyle: {
        marginBottom: 0
      }
    }, global.React.createElement(TabsContent, {
      tab: global.React.createElement(TabLabel, null, "Logs"),
      key: "logs"
    }, global.React.createElement(_Logs.Logs, _extends({
      active: activeKey === 'logs'
    }, store))), global.React.createElement(TabsContent, {
      tab: global.React.createElement(TabLabel, null, "Linking"),
      key: "linking"
    }, global.React.createElement(_LinkingTester.LinkingTester, _extends({
      active: activeKey === 'linking'
    }, store))));
  }

  const TabLabel = _flipper.styled.span({
    padding: `0 ${_flipperPlugin.theme.space.large}px`
  });

  const TabsContent = (0, _flipper.styled)(TabPane)({
    height: 'calc(100vh - 80px)'
  });
},0,[1,5,6,7],"src/index.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LinkingTester = LinkingTester;
  var _antd = global.antd;
  var _flipper = global.Flipper;
  var _flipperPlugin = global.FlipperPlugin;

  var React = _interopRequireWildcard(global.React);

  var _RouteMap = _$$_REQUIRE(_dependencyMap[0], "./RouteMap");

  var _Sidebar = _$$_REQUIRE(_dependencyMap[1], "./Sidebar");

  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

  function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function LinkingTester({
    linking,
    active
  }) {
    const [rawConfig, setRawConfig] = global.React.useState('');
    const [path, setPath] = global.React.useState('');
    const [state, setState] = global.React.useState();
    const [action, setAction] = global.React.useState();
    const [error, setError] = global.React.useState();
    global.React.useEffect(() => {
      (async () => {
        try {
          const state = await linking('getStateFromPath', path.replace(/(^\w+:|^)\/\//, ''), rawConfig);
          const action = state ? await linking('getActionFromState', state, rawConfig) : undefined;
          setState(state);
          setAction(action);
          setError(undefined);
        } catch (e) {
          setState(undefined);
          setAction(undefined);
          setError((e === null || e === void 0 ? void 0 : e.message) || 'Failed to parse the path. Make sure that the path matches the patterns specified in the config.');
        }
      })();
    }, [linking, path, rawConfig]);
    return global.React.createElement(Container, null, global.React.createElement(CodeInput, {
      type: "text",
      value: path,
      placeholder: "Type a path to display parsed screens, e.g. /users/@vergil",
      onChange: e => setPath(e.target.value)
    }), global.React.createElement(Details, null, global.React.createElement(Summary, null, "Custom configuration (Advanced)"), global.React.createElement(CodeEditor, {
      rows: 5,
      value: rawConfig,
      placeholder: "Type a custom linking config (leave empty to use the config defined in the app)",
      onChange: e => setRawConfig(e.target.value)
    })), global.React.createElement(Section, null, state ? global.React.createElement(_RouteMap.RouteMap, {
      routes: state.routes
    }) : error ? global.React.createElement(ErrorDescription, null, "Error: ", error) : null, active ? global.React.createElement(_flipper.DetailSidebar, null, action && global.React.createElement(_Sidebar.Sidebar, {
      action: action,
      state: state
    })) : null));
  }

  const Container = _flipper.styled.div({
    height: '100%',
    overflow: 'auto'
  });

  const Summary = _flipper.styled.summary({
    margin: `0 ${_flipperPlugin.theme.space.large}px`
  });

  const Section = _flipper.styled.div({
    margin: `${_flipperPlugin.theme.space.large}px 0`
  });

  const Details = _flipper.styled.details({
    margin: `${_flipperPlugin.theme.space.large}px 0`
  });

  const CodeInput = (0, _flipper.styled)(_antd.Input)({
    display: 'block',
    fontFamily: _flipperPlugin.theme.monospace.fontFamily,
    fontSize: _flipperPlugin.theme.monospace.fontSize,
    padding: _flipperPlugin.theme.space.medium,
    margin: _flipperPlugin.theme.space.large,
    width: `calc(100% - ${_flipperPlugin.theme.space.large * 2}px)`
  });
  const CodeEditor = (0, _flipper.styled)(_antd.Input.TextArea)({
    display: 'block',
    fontFamily: _flipperPlugin.theme.monospace.fontFamily,
    fontSize: _flipperPlugin.theme.monospace.fontSize,
    padding: _flipperPlugin.theme.space.medium,
    margin: _flipperPlugin.theme.space.large,
    width: `calc(100% - ${_flipperPlugin.theme.space.large * 2}px)`
  });

  const ErrorDescription = _flipper.styled.p({
    margin: _flipperPlugin.theme.space.huge,
    color: _flipperPlugin.theme.errorColor
  });
},1,[2,3],"src/LinkingTester.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RouteMap = RouteMap;
  var _flipper = global.Flipper;
  var _flipperPlugin = global.FlipperPlugin;

  var React = _interopRequireWildcard(global.React);

  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

  function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function RouteMap({
    routes,
    root = true
  }) {
    return global.React.createElement(Container, {
      style: { ...(root ? {
          overflowX: 'auto',
          padding: `0 ${_flipperPlugin.theme.space.small}px`
        } : null)
      }
    }, routes.map((route, i) => global.React.createElement(Item, {
      key: route.name
    }, global.React.createElement("div", null, global.React.createElement(Name, null, route.name, root ? null : i === 0 ? global.React.createElement(ConnectLeft, null) : global.React.createElement(ConnectUpLeft, null)), route.params ? global.React.createElement(ParamsContainer, null, global.React.createElement(Params, null, global.React.createElement("tbody", null, Object.entries(route.params).map(([key, value]) => global.React.createElement(Row, {
      key: key
    }, global.React.createElement(Key, null, key), global.React.createElement(Separator, null, ":"), global.React.createElement(Value, null, JSON.stringify(value)))))), global.React.createElement(ConnectUp, null)) : null), route.state ? global.React.createElement(RouteMap, {
      routes: route.state.routes,
      root: false
    }) : null)));
  }

  const Container = _flipper.styled.div({
    display: 'flex',
    flexDirection: 'column'
  });

  const Item = _flipper.styled.div({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start'
  });

  const Name = _flipper.styled.div({
    minWidth: 120,
    backgroundColor: _flipperPlugin.theme.primaryColor,
    color: 'white',
    fontSize: _flipperPlugin.theme.fontSize.default,
    margin: _flipperPlugin.theme.space.small,
    padding: `${_flipperPlugin.theme.space.small}px ${_flipperPlugin.theme.space.large}px`,
    borderRadius: _flipperPlugin.theme.borderRadius,
    position: 'relative',
    textAlign: 'center'
  });

  const ParamsContainer = _flipper.styled.div({
    position: 'relative'
  });

  const Params = _flipper.styled.table({
    minWidth: 120,
    borderCollapse: 'separate',
    border: `1px solid ${_flipperPlugin.theme.primaryColor}`,
    fontFamily: _flipperPlugin.theme.monospace.fontFamily,
    fontSize: _flipperPlugin.theme.monospace.fontSize,
    margin: `${_flipperPlugin.theme.space.large}px ${_flipperPlugin.theme.space.small}px`,
    padding: _flipperPlugin.theme.space.small,
    borderRadius: _flipperPlugin.theme.borderRadius,
    width: 'auto',
    overflow: 'visible'
  });

  const Row = _flipper.styled.tr({
    border: 0,
    background: 'none'
  });

  const Key = _flipper.styled.td({
    color: _flipperPlugin.theme.textColorSecondary,
    border: 0,
    padding: '0 4px',
    textAlign: 'right'
  });

  const Value = _flipper.styled.td({
    color: _flipperPlugin.theme.primaryColor,
    padding: `0 ${_flipperPlugin.theme.space.tiny}px`,
    border: 0
  });

  const Separator = _flipper.styled.td({
    color: 'inherit',
    opacity: 0.3,
    border: 0,
    padding: 0
  });

  const ConnectLeft = _flipper.styled.div({
    position: 'absolute',
    width: 16,
    height: 1,
    backgroundColor: _flipperPlugin.theme.primaryColor,
    right: '100%',
    top: '50%'
  });

  const ConnectUpLeft = _flipper.styled.div({
    position: 'absolute',
    width: 9,
    height: 53,
    border: `1px solid ${_flipperPlugin.theme.primaryColor}`,
    borderRadius: `0 0 0 ${_flipperPlugin.theme.borderRadius}`,
    borderRight: 0,
    borderTop: 0,
    right: '100%',
    bottom: '50%'
  });

  const ConnectUp = _flipper.styled.div({
    position: 'absolute',
    width: 1,
    height: 16,
    backgroundColor: _flipperPlugin.theme.primaryColor,
    right: '50%',
    bottom: '100%'
  });
},2,[],"src/RouteMap.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Sidebar = Sidebar;
  var _flipper = global.Flipper;
  var _flipperPlugin = global.FlipperPlugin;

  var React = _interopRequireWildcard(global.React);

  var _Typography = _$$_REQUIRE(_dependencyMap[0], "./Typography");

  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

  function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function Sidebar({
    action,
    state,
    stack
  }) {
    return global.React.createElement(_flipper.Layout.Container, {
      gap: true,
      pad: true
    }, stack ? global.React.createElement(global.React.Fragment, null, global.React.createElement(_Typography.Title4, null, "Stack"), global.React.createElement(Code, null, stack.split('\n').map((line, index) => {
      const match = line.match(/^(.+)@(.+):(\d+):(\d+)$/);

      if (match) {
        const [, methodName, file, lineNumber, column] = match;

        if (file.includes('/node_modules/@react-navigation')) {
          return null;
        }

        return global.React.createElement("div", {
          key: index
        }, methodName.split('.').map((part, i, self) => {
          if (i === self.length - 1 && i !== 0) {
            return global.React.createElement(Method, null, part);
          }

          if (self.length !== 1) {
            return global.React.createElement(global.React.Fragment, null, part, global.React.createElement(Separator, null, "."));
          }

          return part;
        }), ' ', global.React.createElement(Separator, null, "("), global.React.createElement(StringToken, null, file.split('/').pop()), global.React.createElement(Separator, null, ":"), global.React.createElement(NumberToken, null, lineNumber), ":", global.React.createElement(NumberToken, null, column), global.React.createElement(Separator, null, ")"));
      }

      return global.React.createElement("div", {
        key: index
      }, line);
    }))) : null, global.React.createElement(_Typography.Title4, null, "Action"), global.React.createElement(_flipper.ManagedDataInspector, {
      data: action,
      expandRoot: false
    }), global.React.createElement(_Typography.Title4, null, "State"), global.React.createElement(_flipper.ManagedDataInspector, {
      data: state,
      expandRoot: false
    }));
  }

  const Code = _flipper.styled.div({
    fontSize: 11,
    fontFamily: _flipperPlugin.theme.monospace.fontFamily,
    margin: '7.5px 0px'
  });

  const StringToken = _flipper.styled.span({
    color: 'rgb(224, 76, 96)'
  });

  const NumberToken = _flipper.styled.span({
    color: 'rgb(77, 187, 166)'
  });

  const Method = _flipper.styled.span({
    color: 'rgb(123, 100, 192)'
  });

  const Separator = _flipper.styled.span({
    color: '#555'
  });
},3,[4],"src/Sidebar.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Title4 = void 0;
  var _flipper = global.Flipper;
  var _flipperPlugin = global.FlipperPlugin;

  const Title4 = _flipper.styled.h4({
    fontWeight: 600,
    fontSize: _flipperPlugin.theme.fontSize.default,
    lineHeight: 1.4,
    letterSpacing: -0.24,
    marginBottom: 0
  });

  exports.Title4 = Title4;
},4,[],"src/Typography.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Logs = Logs;
  var _icons = global.antdesign_icons;
  var _flipperPlugin = global.FlipperPlugin;

  var React = _interopRequireWildcard(global.React);

  var _Sidebar = _$$_REQUIRE(_dependencyMap[0], "./Sidebar");

  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

  function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function Logs({
    active,
    logs,
    index,
    resetTo
  }) {
    const [selectedID, setSelectedID] = global.React.useState(null);
    const selectedItem = selectedID ? logs.find(log => log.id === selectedID) : logs[logs.length - 1];
    return logs.length ? global.React.createElement(global.React.Fragment, null, global.React.createElement(_flipperPlugin.DataList, {
      style: {
        height: '100%'
      },
      items: logs,
      onRenderItem: ({
        id,
        action
      }, _, i) => global.React.createElement(Row, {
        key: id,
        selected: (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.id) === id,
        faded: index != null ? index > -1 && i > index : false,
        onClick: () => {
          if (id === logs[logs.length - 1].id) {
            setSelectedID(null);
          } else {
            setSelectedID(id);
          }
        }
      }, action.type, global.React.createElement(JumpButton, {
        type: "button",
        onClick: () => resetTo(id)
      }, "Reset to this"))
    }), active ? global.React.createElement(_flipperPlugin.DetailSidebar, null, selectedItem && global.React.createElement(_Sidebar.Sidebar, {
      action: selectedItem.action,
      state: selectedItem.state,
      stack: selectedItem.stack
    })) : null) : global.React.createElement(Center, null, global.React.createElement(Faded, null, global.React.createElement(EmptyIcon, null), global.React.createElement(BlankslateText, null, "Navigate in the app to see actions")));
  }

  const Row = _flipperPlugin.styled.button(props => ({
    'appearance': 'none',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'space-between',
    'fontFamily': _flipperPlugin.theme.monospace.fontFamily,
    'fontSize': _flipperPlugin.theme.monospace.fontSize,
    'textAlign': 'left',
    'padding': `${_flipperPlugin.theme.space.medium}px ${_flipperPlugin.theme.space.large}px`,
    'color': props.selected ? '#fff' : '#000',
    'backgroundColor': props.selected ? _flipperPlugin.theme.primaryColor : 'transparent',
    'opacity': props.faded ? 0.5 : 1,
    'border': 0,
    'boxShadow': `inset 0 -1px 0 0 ${_flipperPlugin.theme.dividerColor}`,
    'width': '100%',
    'cursor': 'pointer',
    '&:hover': {
      backgroundColor: props.selected ? _flipperPlugin.theme.primaryColor : 'rgba(0, 0, 0, 0.05)'
    }
  }));

  const JumpButton = _flipperPlugin.styled.button({
    'appearance': 'none',
    'backgroundColor': 'rgba(0, 0, 0, 0.1)',
    'border': 0,
    'margin': 0,
    'padding': `${_flipperPlugin.theme.space.tiny}px ${_flipperPlugin.theme.space.medium}px`,
    'color': 'inherit',
    'cursor': 'pointer',
    'fontSize': _flipperPlugin.theme.fontSize.small,
    'borderRadius': _flipperPlugin.theme.borderRadius,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
  });

  const Center = _flipperPlugin.styled.div({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  });

  const Faded = _flipperPlugin.styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    opacity: 0.3
  });

  const EmptyIcon = (0, _flipperPlugin.styled)(_icons.CompassOutlined)({
    display: 'block',
    fontSize: 48,
    margin: _flipperPlugin.theme.space.large,
    opacity: 0.8
  });

  const BlankslateText = _flipperPlugin.styled.h5({
    color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 1.5
  });
},5,[3],"src/Logs.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.useStore = useStore;
  var _flipperPlugin = global.FlipperPlugin;

  var _plugin = _$$_REQUIRE(_dependencyMap[0], "./plugin");

  function useStore() {
    const instance = (0, _flipperPlugin.usePlugin)(_plugin.plugin);
    const logs = (0, _flipperPlugin.useValue)(instance.logs);
    const index = (0, _flipperPlugin.useValue)(instance.index);
    return {
      logs,
      index: index !== null && index !== void 0 ? index : logs.length - 1,
      navigation: instance.navigation,
      linking: instance.linking,
      resetTo: instance.resetTo
    };
  }
},6,[7],"src/useStore.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.plugin = plugin;
  var _flipperPlugin = global.FlipperPlugin;

  function plugin(client) {
    const logs = (0, _flipperPlugin.createState)([], {
      persist: 'logs'
    });
    const index = (0, _flipperPlugin.createState)(null, {
      persist: 'index'
    });
    client.onMessage('init', () => {
      logs.set([]);
      index.set(null);
    });
    client.onMessage('action', action => {
      const indexValue = index.get();
      index.set(null);
      logs.update(draft => {
        if (indexValue != null) {
          draft.splice(indexValue + 1);
        }

        draft.push(action);
      });
    });

    function navigation(method, ...args) {
      return client.send('navigation.invoke', {
        method,
        args
      });
    }

    function resetTo(id) {
      const logsValue = logs.get();
      const indexValue = logsValue.findIndex(update => update.id === id);
      const {
        state
      } = logsValue[indexValue];
      index.set(indexValue);
      return client.send('navigation.invoke', {
        method: 'resetRoot',
        args: [state]
      });
    }

    function linking(method, ...args) {
      return client.send('linking.invoke', {
        method,
        args
      });
    }

    return {
      logs,
      index,
      resetTo,
      navigation,
      linking
    };
  }
},7,[],"src/plugin.tsx");
module.exports = global.__r(0);
//# sourceMappingURL=/Users/chris/Github/react-navigation/packages/flipper-plugin-react-navigation/dist/bundle.map