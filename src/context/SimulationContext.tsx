import { createContext, useContext, useState, ReactNode } from 'react';

interface SimulationContextType {
  simulationLoading: string;
  setSimulationLoading: (currentState: string) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const useSimulationCtx = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};

interface SimulationProviderProps {
  children: ReactNode;
}

export const SimulationProvider: React.FC<SimulationProviderProps> = ({ children }) => {
  const [loadingState, setLoadingState] = useState<string>('Run Simulation');

  return (
    <SimulationContext.Provider value={{ simulationLoading: loadingState, setSimulationLoading: setLoadingState }}>
      {children}
    </SimulationContext.Provider>
  );
};